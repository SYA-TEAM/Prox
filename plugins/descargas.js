import axios from 'axios';
import crypto from 'crypto';

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],

  crypto: {
    hexToBuffer: (hexString) => {
      const matches = hexString.match(/.{1,2}/g);
      return Buffer.from(matches.join(''), 'hex');
    },

    decrypt: async (enc) => {
      try {
        const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = savetube.crypto.hexToBuffer(secretKey);

        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(content);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return JSON.parse(decrypted.toString());
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    }
  },

  isUrl: str => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  },

  youtube: url => {
    if (!url) return null;
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let p of patterns) {
      if (p.test(url)) return url.match(p)[1];
    }
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return {
        status: true,
        code: 200,
        data: response
      };
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        error: error.message
      };
    }
  },

  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return {
      status: true,
      code: 200,
      data: response.data.cdn
    };
  },

  download: async (link, format) => {
    if (!link) {
      return {
        status: false,
        code: 400,
        error: "¿Dónde está el link? No puedes descargar sin un link 🗿"
      };
    }

    if (!savetube.isUrl(link)) {
      return {
        status: false,
        code: 400,
        error: "¡Pon un link de YouTube válido, por favor! 🗿"
      };
    }

    if (!format || !savetube.formats.includes(format)) {
      return {
        status: false,
        code: 400,
        error: "Formato no disponible, elige uno de los que están listados 🗿",
        available_fmt: savetube.formats
      };
    }

    const id = savetube.youtube(link);
    if (!id) {
      return {
        status: false,
        code: 400,
        error: "No se puede extraer el link de YouTube, verifica el link y prueba de nuevo 😂"
      };
    }

    try {
      const cdnx = await savetube.getCDN();
      if (!cdnx.status) return cdnx;
      const cdn = cdnx.data;

      const result = await savetube.request(`https://${cdn}${savetube.api.info}`, {
        url: `https://www.youtube.com/watch?v=${id}`
      });
      if (!result.status) return result;
      const decrypted = await savetube.crypto.decrypt(result.data.data);

      const durationInMinutes = decrypted.duration / 60;
      if (durationInMinutes > 60) {
        return {
          status: false,
          code: 400,
          error: "El video es demasiado largo (más de 60 minutos) para ser descargado en este momento."
        };
      }

      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id: id,
        downloadType: format === 'mp3' ? 'audio' : 'video',
        quality: format === 'mp3' ? '128' : format,
        key: decrypted.key
      });

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "Desconocido 🤷🏻",
          type: format === 'mp3' ? 'audio' : 'video',
          format: format,
          thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: dl.data.data.downloadUrl,
          id: id,
          key: decrypted.key,
          duration: decrypted.duration,
          quality: format === 'mp3' ? '128' : format,
          downloaded: dl.data.data.downloaded || false
        }
      };

    } catch (error) {
      return {
        status: false,
        code: 500,
        error: error.message
      };
    }
  }
};

const handler = async (m, { conn, args, command }) => {
  if (args.length < 1) return m.reply(`*[ ℹ️ ] Ingresa una URL de un video o audio de YouTube*`);

  const url = args[0];
  const format = command === 'ytmp3g' ? 'mp3' : args[1] || '360';

  if (!savetube.isUrl(url)) return m.reply("Por favor, ingresa un link válido de YouTube.");

  try {
    await m.react('🕒');

    const res = await savetube.download(url, format);
    if (!res.status) {
      await m.react('✖️');
      return m.reply(`❌ *Error:* ${res.error}`);
    }

    const { title, download, type, thumbnail, quality, duration } = res.result;

    const caption = `🎬 *${title}*\n📥 *Formato:* ${type} | ${quality}p\n⏱ *Duración:* ${duration}s`;

    if (type === 'video') {
      await conn.sendMessage(m.chat, {
        video: { url: download },
        caption,
        fileName: `${title}.mp4`,
        mimetype: 'video/mp4'
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `${title}.mp3`
      }, { quoted: m });
    }

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('✖️');
    m.reply(`*❌ ¡Fallo en la descarga!*\n_Mensaje:_ ${e.message}`);
  }
};

handler.help = ['ytmp4 <url> [calidad]', 'ytmp3 <url>'];
handler.command = ['ytmp4x', 'ytmp3g'];
handler.tags = ['dl'];

export default handler;
