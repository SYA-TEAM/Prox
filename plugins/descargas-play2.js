import fetch from 'node-fetch';
import fg from 'senna-fg';

let handler = async(m, { conn, usedPrefix, command, text }) => {

if (!text) return m.reply(`Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command}space of you`);

try {
let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();

let results = api.data[0];

let txt = `❀ *Título:* ${results.title}\n✹ *Duración:* ${results.duration}\n❐ *Link:* ${results.url}`;

let img = results.image;

/* conn.sendMessage(m.chat, { 
        image: { url: img }, 
        caption: txt, 
        footer: dev, 
        buttons: [
            {
                buttonId: `.ytmp4doc ${results.url}`,
                buttonText: { displayText: 'Obtener Video' }
            }
        ],
        viewOnce: true,
        headerType: 4
    }, { quoted: m });
*/

m.react('🕒');
conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

let data = await fg.ytmp4(results.url);
let url = data.dl_url;

await conn.sendMessage(m.chat, { video: { url: url }, fileName: `${results.title}.mp4`, caption: `> ${wm}`, mimetype: 'video/mp4' }, { quoted: m })
m.react('✅');     

} catch (e) {
m.reply(`Error: ${e.message}`);
m.react('✖️');
  }
}

handler.command = ['pvideo', 'play2'];

export default handler