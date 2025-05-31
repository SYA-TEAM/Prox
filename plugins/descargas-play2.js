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

    // Enviar texto decorado y reaccionar de inmediato
    await conn.sendMessage(m.chat, {
      text: textoBonito,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: `☛ 𝗗𝘂𝗿𝗮𝗰𝗶𝗼́𝗻: ${video.duration} | ➡︎ 𝗖𝗮𝗻𝗮𝗹: ${video.author.name}`,
          thumbnailUrl: video.image,
          sourceUrl: 'https://chat.whatsapp.com/DzoM73E8Fb7BvnUwquQuGr',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    }, { quoted: m });

    await m.react("⏱️"); // Reacciona rápido mientras descarga

    // Descargar el audio del video
    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url;

    // Enviar el audio como nota de voz
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: '🎧 MP3 ❤️‍🔥',
          thumbnailUrl: video.image,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: false,
          sourceUrl: video.url
        }
      }
    }, { quoted: m });

    await m.react("✅"); // Reacciona al terminar

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['playaudio', 'play'];
handler.help = ['play <texto>'];
handler.tags = ['media'];

export default handler;
