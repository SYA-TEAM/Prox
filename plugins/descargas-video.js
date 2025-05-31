import WebTorrent from 'webtorrent';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎬 Escribe el nombre de la película. Ejemplo: `.pelicula john wick`');

  const query = encodeURIComponent(text.trim());
  const apiUrl = `https://yts.mx/api/v2/list_movies.json?query_term=${query}`;

  try {
    m.reply(`🔍 Buscando la película *${text}*...`);

    const res = await axios.get(apiUrl);
    const movies = res.data?.data?.movies;

    if (!movies || movies.length === 0) {
      return m.reply('❌ No se encontró ninguna película con ese nombre.');
    }

    const movie = movies[0];
    const title = movie.title_long;
    const torrent = movie.torrents.find(t => t.quality === '720p') || movie.torrents[0];
    const magnet = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(title)}&tr=udp://tracker.openbittorrent.com:80`;

    m.reply(`⬇️ Descargando: *${title}* (${torrent.quality})... por favor espera, esto puede tardar varios minutos.`);

    const client = new WebTorrent();
    client.add(magnet, { path: '/tmp' }, async torrent => {
      const file = torrent.files.find(file => file.name.endsWith('.mp4') || file.name.endsWith('.mkv'));

      if (!file) {
        client.destroy();
        return m.reply('❌ No se encontró un archivo de video válido en el torrent.');
      }

      const filePath = path.join('./tmp', file.path);
      const stream = file.createReadStream();
      const writeStream = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const stats = fs.statSync(filePath);
      if (stats.size > 2 * 1024 * 1024 * 1024) {
        fs.unlinkSync(filePath);
        return m.reply('❌ El archivo supera los 2 GB permitidos por WhatsApp.');
      }

      await conn.sendMessage(m.chat, {
        document: fs.readFileSync(filePath),
        fileName: file.name,
        mimetype: 'video/mp4'
      }, { quoted: m });

      fs.unlinkSync(filePath);
      torrent.destroy();
    });

  } catch (err) {
    console.error(err);
    m.reply('❌ Error al buscar o descargar la película.');
  }
};

handler.command = ['pelicula', 'movie'];
handler.help = ['pelicula <nombre>'];
handler.tags = ['descargas'];

export default handler;