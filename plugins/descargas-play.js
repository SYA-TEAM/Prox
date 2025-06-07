// By wirk para Anya

import fetch from 'node-fetch';

let handler = async(m, { conn, usedPrefix, command, text }) => {

if (!text) return m.reply(`✿ Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command}Bella Wolfine`);

try {
let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();

let results = api.data[0];

let txt = `「✿」 ✦ *𝖳𝗂𝗍𝗎𝗅𝗈 =* ${results.title}\n✦ *𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇 =* ${results.duration}\n✦ *𝖫𝗂𝗇𝗄: =* ${results.url}\n✦ *𝖯𝗎𝖻𝗅𝗂𝖼𝖺𝖽𝗈 =* ${results.publishedAt}`;

let img = results.image;

conn.sendMessage(m.chat, { 
        image: { url: img }, 
        caption: txt, 
        footer: dev, 
        buttons: [
            {
                buttonId: `.ytmp4 ${results.url}`,
                buttonText: { displayText: '❀ Descargar ❀' }
            }
        ],
        viewOnce: true,
        headerType: 4
    }, { quoted: m });

} catch (e) {
m.reply(`Error: ${e.message}`);
m.react('✖️');
  }
}

handler.command = ['play2', 'mp4'];

export default handler
