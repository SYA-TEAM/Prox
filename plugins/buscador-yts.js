import yts from 'yt-search'

let handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, '🍭 *Por favor, ingresa una búsqueda de YouTube.*', m)

  await m.react('🔎')
  conn.reply(m.chat, '*⏳ Buscando resultado, espera un momento...*', m)

  let results = await yts(text)
  let video = results.videos[0]

  if (!video) return conn.reply(m.chat, '❌ No se encontraron resultados.', m)

  let caption = `
「🎬」 *${video.title}*
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.timestamp}
📅 *Subido:* ${video.ago}
👁 *Vistas:* ${video.views}
🔗 *Enlace:* ${video.url}
`

  let buttons = [
    { buttonId: `.play ${video.url}`, buttonText: { displayText: '▶️ Audio' }, type: 1 },
    { buttonId: `.ytmp4 ${video.url}`, buttonText: { displayText: '📹 Video' }, type: 1 },
    { buttonId: video.url, buttonText: { displayText: '🔗 Ver en YouTube' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    footer: 'Selecciona una opción:',
    buttons
  }, { quoted: m })
}

handler.help = ['ytbuscar', 'ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler