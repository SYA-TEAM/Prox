import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `❗ Por favor ingresa un texto para buscar.\nEjemplo: ${usedPrefix + command} Nombre del video`;
  }


  const search = await yts(text);
  const videoInfo = search.all?.[0];

  if (!videoInfo) {
    throw '❗ No se encontraron resultados para tu búsqueda. Intenta con otro título.';
  }

  const body = `*✦ ʏᴏᴜᴛᴜʙᴇ ᴘʟᴀʏ ✦*
  
𝖤𝗅𝗂𝗀𝖾 𝗎𝗇𝖺 𝖽𝖾 𝗅𝖺𝗌 𝗈𝗉𝖼𝗂𝗈𝗇𝖾𝗌:
*Audio* o *Video*
  `;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: videoInfo.thumbnail },
      caption: body,
      footer: `✿ ᴀɴʏᴀ ғᴏʀɢᴇʀ ✿| ❒`,
      buttons: [
        { buttonId: `.playaudio ${videoInfo.url}`, buttonText: { displayText: '✦ Audio ✦' } },
        { buttonId: `.ytmp4 ${videoInfo.url}`, buttonText: { displayText: '✦ Video ✦' } },
      ],
      viewOnce: true,
      headerType: 4,
    },
    { quoted: m }
  );
  m.react('✅'); // Reacción de éxito
};

handler.command = ['play', 'playvid', 'play2'];
handler.tags = ['downloader']
handler.group = true
handler.limit = 6

export default handler;