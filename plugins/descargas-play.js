// By wirk para Anya

import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✿ Ingresa un texto para buscar en YouTube\n> *Ejemplo:* ${usedPrefix + command} Bella Wolfine`);

  await m.react('🕒'); // Reacción mientras busca

  try {
    let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`)).json();
    let result = api.data[0];

    let txt = `「✿」 ✦ *𝖳𝗂𝗍𝗎𝗅𝗈 =* ${result.title}
✦ *𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇 =* ${result.duration}
✦ *𝖫𝗂𝗇𝗄 =* ${result.url}
✦ *𝖯𝗎𝖻𝗅𝗂𝖼𝖺𝖽𝗈 =* ${result.publishedAt}`;

    await conn.sendMessage(m.chat, {
      image: { url: result.image },
      caption: txt,
      footer: 'By Wirk para Anya',
      buttons: [
        {
          buttonId: `.ytmp4 ${result.url}`,
          buttonText: { displayText: '❀ Descargar ❀' }
        }
      ],
      viewOnce: true,
      headerType: 4
    }, { quoted: m });

    await m.react('✅'); // Reacción al terminar
  } catch (e) {
    await m.react('✖️');
    m.reply(`Error: ${e.message}`);
  }
};

handler.command = ['play2', 'mp4'];
export default handler;
