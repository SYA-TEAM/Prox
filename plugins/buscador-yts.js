import yts from 'yt-search'

var handler = async (m, { text, conn, command }) => {
  try {
    if (!text) return conn.reply(m.chat, '❗ Ingresa una búsqueda para YouTube.', rcanal)

    await conn.reply(m.chat, '⏳ Buscando en YouTube...', rcanal)

    const results = await yts(text)
    const videos = results.all.filter(v => v.type === 'video')

    if (!videos.length) return conn.reply(m.chat, '⚠️ No se encontraron resultados.', rcanal)

    const teks = videos.map(v => `「✦」Resultados de la búsqueda para <${text}>

> ☁️ Título » ${v.title}
🍬 Canal » ${v.author.name}
🕝 Duración » ${v.timestamp}
📆 Subido » ${v.ago}
👀 Vistas » ${v.views}
🔗 Enlace » ${v.url}`).join('\n\n••••••••••••••••••••••••••••••••••••\n\n')

    await conn.sendFile(m.chat, videos[0].thumbnail, 'yts.jpeg', teks, rcanal)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Ocurrió un error al buscar en YouTube.', rcanal)
  }
}

handler.help = ['ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler