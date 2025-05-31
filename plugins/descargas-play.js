import fetch from 'node-fetch';
import yts from 'yt-search';

const limit = 250; // MB máximo permitido

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('🌸 Ingresa el nombre de un video de YouTube para buscar.');

  try {
    await m.react('🔥');
    const res = await yts(text);
    const video = res.all[0];

    if (!video) return m.reply('❌ No se encontró ningún resultado.');

    const encabezado = `> ✦ 𝖠𝗇𝗒𝖺 𝖥𝗈𝗋𝗀𝖾𝗋 𝖯𝗅𝖺𝗒𝟤 ✦`;

    const textoBonito = `${encabezado}`;

    // Enviar miniatura decorada
    await conn.sendFile(m.chat, video.thumbnail, 'thumb.jpg', textoBonito, m, null, {
      contextInfo: {
        externalAdReply: {
          title: `♪ ${video.title}`,
          body: `🌸 Anya Forger Play2`,
          thumbnailUrl: video.thumbnail,
          sourceUrl: video.url,
          mediaType: 2,
          renderLargerThumbnail: false,
          showAdAttribution: false
        }
      }
    });

    // Enviar audio o video SIN caption
    if (command === 'play2' || command === 'playvid') {
      const api = await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`);
      const json = await api.json();

      if (!json.data || !json.data.dl_url) throw '❌ Error al descargar el video.';

      const doc = json.data.size_mb >= limit;
      await conn.sendFile(m.chat, json.data.dl_url, `${json.data.title}.mp4`, '', m, null, {
        asDocument: doc,
        fileName: `${json.data.title}.mp4`,
        mimetype: 'video/mp4'
      });

      await m.react('📽️');
    } else if (command === 'play') {
      const api = await fetch(`https://ytdl.sylphy.xyz/dl/mp3?url=${video.url}&quality=128`);
      const json = await api.json();

      if (!json.data || !json.data.dl_url) throw '❌ Error al descargar el audio.';

      await conn.sendFile(m.chat, json.data.dl_url, `${json.data.title}.mp3`, '', m, null, {
        asDocument: json.data.size_mb >= 90,
        mimetype: 'audio/mpeg',
        fileName: `${json.data.title}.mp3`
      });

      await m.react('🎧');
    }

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al procesar tu solicitud.');
  }
};

handler.help = ['play', 'play2'];
handler.tags = ['dl'];
handler.command = ['play2', 'playvid'];

export default handler;
