let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌐 Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Space Off You`);

  try {
    // Buscar video en YouTube
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado
    const textoBonito = `> ✦ 𝖠𝗇𝗒𝖺 𝖥𝗈𝗋𝗀𝖾𝗋 𝖯𝗅𝖺𝗒 ✦`;

    // Enviar mensaje con miniatura, sin texto visible
    await conn.sendMessage(m.chat, {
      text: textoBonito,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: `☛ 𝗗𝘂𝗿𝗮𝗰𝗶𝗼́𝗻: ${video.duration} | ➡︎ 𝗖𝗮𝗻𝗮𝗹: ${video.author.name}`,
          thumbnailUrl: video.image,
          sourceUrl: 'https://chat.whatsapp.com/DzoM73E8Fb7BvnUwquQuGr', // Enlace al grupo
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    }, { quoted: m });

    // Descargar y enviar el audio del video
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
      ptt: false,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['playaudio', 'play'];
handler.help = ['play <texto>'];
handler.tags = ['media'];

export default handler;