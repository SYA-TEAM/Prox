import axios from 'axios';
import yts from 'yt-search';

const handler = async (m, { conn, args }) => {
  const songName = args.join(' ');
  if (!songName) return m.reply('🎵 Por favor, proporciona el nombre de la canción.\n> Ejemplo: *.descargar Shakira - Hips Don\'t Lie*');

  try {
    const results = await yts(songName);
    const video = results.videos[0];
    if (!video) return m.reply('❌ No se encontró ninguna canción con ese nombre.');

    const url = video.url;
    const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${url}`;
    const { data } = await axios.get(apiUrl);

    const downloadUrl = data?.result?.download?.url;
    if (!downloadUrl) return m.reply('❌ No se pudo obtener el audio del video.');

    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply('❌ Error al descargar la canción.');
  }
};

handler.command = ['descargar', 'dl', 'song'];
handler.help = ['descargar <nombre de la canción>'];
handler.tags = ['descargas'];

export default handler;
