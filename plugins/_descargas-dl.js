import axios from 'axios';
import yts from 'yt-search';

const handler = async (m, { conn }) => {
  if (m.text.startsWith('!descargar')) {
    const args = m.text.split(' ');
    if (args.length < 2) return m.reply('Por favor, proporciona el nombre de la canción');

    const songName = args.slice(1).join(' ');
    const results = await yts(songName);
    const video = results.videos[0];

    if (!video) return m.reply('No se encontró la canción');

    const url = video.url;
    const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${url}`;

    try {
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m });

    } catch (error) {
      console.error(error);
      m.reply('Error al descargar la canción');
    }
  }
};

handler.command = ['descargar', 'dl', 'song'];
handler.help = ['descargar <nombre de la canción>'];
handler.tags = ['descargas'];

export default handler;
