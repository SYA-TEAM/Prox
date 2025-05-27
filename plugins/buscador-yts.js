import yts from 'yt-search'

let handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, '🍭 *Por favor, ingresa una búsqueda de YouTube.*', m)

  await m.react('🔎')
  conn.reply(m.chat, '*⏳ Buscando resultados, espera un momento...*', m)

  let results = await yts(text)
  let videos = results.videos.slice(0, 5)

  for (let v of videos) {
    let caption = `
「🎬」 *${v.title}*
📺 *Canal:* ${v.author.name}
⏱️ *Duración:* ${v.timestamp}
📅 *Subido:* ${v.ago}
👁 *Vistas:* ${v.views}
🔗 *Enlace:* ${v.url}
`

    let buttons = [
      { buttonId: `.play ${v.url}`, buttonText: { displayText: '▶️ Audio' }, type: 1 },
      { buttonId: `.ytmp4 ${v.url}`, buttonText: { displayText: '📹 Video' }, type: 1 },
      { buttonId: v.url, buttonText: { displayText: '🔗 Ver en YouTube' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      image: { url: v.thumbnail },
      caption,
      footer: 'Selecciona una opción:',
      buttons
    }, { quoted: m })
  }
}

handler.help = ['ytbuscar', 'ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler