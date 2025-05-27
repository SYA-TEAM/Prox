import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {

  if (!text) return m.reply(`Ingresa un texto para buscar en YouTube\n> *Ejemplo:* ${usedPrefix + command} space of you`);

  try {
    let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();
    let results = api.data[0];

    let txt = `❀ *Título:* ${results.title}\n✹ *Duración:* ${results.duration}\n❐ *Link:* ${results.url}`;
    let img = results.image;

    m.react('🕒');
    await conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

    // Obtener el video usando la nueva API
    let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(results.url)}`);
    let json = await res.json();

    if (!json.status) throw new Error(json.message || 'No se pudo obtener el video');

    let videoUrl = json.result?.url || json.result?.link;

    if (!videoUrl) throw new Error('No se encontró el enlace de descarga');

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      fileName: `${results.title}.mp4`,
      caption: `> ${wm}`,
      mimetype: 'video/mp4'
    }, { quoted: m });

    m.react('✅');

  } catch (e) {
    m.reply(`Error: ${e.message}`);
    m.react('✖️');
  }
}

handler.command = ['pvideo', 'play2'];

export default handler;