let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌐 Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Space Off You`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0];

    const waitMessage = `*⏤͟͟͞͞✰ 𝘠𝘛 𝘗𝘓𝘈𝘠 ✰⏤͟͟͞͞*
❀ *Título:* ${video.title}
❀ *Duración:* ${video.duration}
❀ *Canal:* ${video.author.name}
> ➮ 𝖯𝗋𝗈𝗏𝗂𝗏𝖾𝖽 𝖡𝗒 𝖠𝗇𝗒𝖺 𝖥𝗈𝗋𝗀𝖾𝗋 ✿`;

    await conn.sendMessage(m.chat, {
      text: waitMessage,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: `☛ 𝗗𝘂𝗿𝗮𝗰𝗶𝗼́𝗻: ${video.duration} | ➡︎ 𝗖𝗮𝗻𝗮𝗹: ${video.author.name}`,
          thumbnailUrl: video.image,
          mediaUrl: "https://chat.whatsapp.com/DzoM73E8Fb7BvnUwquQuGr",
          sourceUrl: "https://chat.whatsapp.com/DzoM73E8Fb7BvnUwquQuGr"
        }
      }
    }, { quoted: m });

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg', ptt: true,
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