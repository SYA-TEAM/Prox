let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌐 Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Space Off You`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado

    const waitMessage = `*⏤͟͟͞͞✰ 𝘠𝘛 𝘗𝘓𝘈𝘠 ✰⏤͟͟͞͞*
❀ *Título:* ${video.title}
❀ *Duración:* ${video.duration}
❀ *Canal:* ${video.author.name}
🎀 Únete a nuestro grupo tocando el botón de abajo ✨`;

    const groupLink = 'https://chat.whatsapp.com/DzoM73E8Fb7BvnUwquQuGr';

    await conn.sendMessage(m.chat, {
      text: waitMessage,
      footer: 'By Anya Forger ✿',
      buttons: [
        {
          buttonId: `.menu`,
          buttonText: { displayText: '📂 Menú' },
          type: 1
        },
        {
          buttonId: groupLink,
          buttonText: { displayText: '📥 Unirse al grupo' },
          type: 1
        }
      ],
      headerType: 4,
      image: { url: video.image }
    }, { quoted: m });

    // Descarga de audio
    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['playaudio', 'play'];
handler.help = ['play <texto>', 'play <texto>'];
handler.tags = ['media'];

export default handler;