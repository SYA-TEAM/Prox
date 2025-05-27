// YTMP4 BY WIRK 
//CODE OFC ANYA FORGER
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Ingresa un link de YouTube válido\n> Ejemplo https://youtu.be/P4LfHsUnNL8?si=ahDKJ5h0cW-EB9C9`, m, rcanal);

  await m.react('🕓');

  try {
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${text}`)).json();
    let dl_url = api.data.dl;

    await conn.sendMessage(m.chat, {
      video: { url: dl_url },
      caption: `*Aquí tienes 💋*\n> ❀ Send By Anya Forger`,
    }, { quoted: m });

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    conn.reply(m.chat, `✖️ Error al usar el comando ${usedPrefix + command} *<url>*`, m, rcanal);
  }
};

handler.help = ['ytmp4 *<url>*'];
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytv'];
handler.register = true;

export default handler;