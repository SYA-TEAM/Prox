let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✐ ₊˚ʚ🌸ɞ˚₊ Ingresa un texto para buscar en YouTube.\n🎶 Ejemplo: *${usedPrefix + command} Shakira*`);

  try {
    await m.react('🕒');

    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      await m.react('💔');
      return m.reply(`(｡•́︿•̀｡) No encontré resultados para: *${text}*`);
    }

    const video = searchData.data[0];
    const { title, url, duration, views, author, uploaded } = video;

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      await m.react('💢');
      return m.reply("｡ﾟ･ (>﹏<) ･ﾟ｡ No se pudo obtener el audio.");
    }

    // Mensaje kawaii decorado
    const infoMessage = `
「✦」 *<${title || 'Desconocido'}>*

> ✧ Canal » *${author?.name || 'Desconocido'}*
> ✰ Vistas » *${views || 'Desconocido'}*
> ⴵ Duración » *${duration || 'Desconocido'}*
> ✐ Publicado » *${uploaded || 'Desconocido'}*
> 🜸 Link » ${url}
`.trim();

    await m.reply(infoMessage);

    await conn.sendMessage(m.chat, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

    await m.react("💜");
  } catch (error) {
    console.error(error);
    await m.react('💢');
    m.reply(`(×﹏×) Ocurrió un error al procesar:\n${error.message}`);
  }
};

handler.command = ['playaudio', 'play'];
handler.help = ['playaudio <texto>'];
handler.tags = ['media'];

export default handler;