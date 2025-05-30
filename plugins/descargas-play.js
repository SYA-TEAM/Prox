import fetch from 'node-fetch';
import yts from 'yt-search';

const limit = 250; // ahora permite hasta 250 MB

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('💖 Ingresa el nombre de un video o una URL de YouTube.');

  try {
    await m.react('🕒');
    const res = await yts(text);
    const video = res.all[0];

    if (!video) return m.reply('❌ No se encontró ningún resultado.');

    const caption = `🎧 *${video.title}*
👤 *Autor:* ${video.author.name}
🕓 *Duración:* ${video.duration.timestamp}
🔗 *Link:* ${video.url}
    
👉🏻 *Espere un momento en lo que envío su audio..*`;

    // Mostrar miniatura con mensaje bonito
    await conn.sendFile(m.chat, video.thumbnail, 'thumbnail.jpg', caption, m);

    if (command === 'play') {
      const api = await fetch(`https://ytdl.sylphy.xyz/dl/mp3?url=${video.url}&quality=128`);
      const json = await api.json();

      if (!json.data || !json.data.dl_url) throw '❌ Error al descargar el audio.';

      await conn.sendFile(m.chat, json.data.dl_url, `${json.data.title}.mp3`, '', m, null, {
        asDocument: json.data.size_mb >= 90,
        mimetype: 'audio/mpeg',
        fileName: `${json.data.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: json.data.title,
            body: "🌸 Anya ",
            thumbnailUrl: video.thumbnail,
            sourceUrl: video.url,
            mediaType: 2,
            renderLargerThumbnail: true,
            showAdAttribution: true,
          },
        },
      });
      await m.react('✅');

    } else if (command === 'play2' || command === 'playvid') {
      const api = await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`);
      const json = await api.json();

      if (!json.data || !json.data.dl_url) throw '❌ Error al descargar el video.';

      const doc = json.data.size_mb >= limit;
      await conn.sendFile(m.chat, json.data.dl_url, `${json.data.title}.mp4`, '', m, null, {
        asDocument: doc,
      });
      await m.react('✔️');
    }
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al procesar tu solicitud.');
  }
};

handler.help = ['play', 'play2'];
handler.tags = ['dl'];
handler.command = ['play', 'play2', 'playvid'];

export default handler;