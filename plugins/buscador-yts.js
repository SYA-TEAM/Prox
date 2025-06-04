import yts from 'yt-search'

var handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `🔍 ιᥒgrᥱsᥲ ᥙᥒᥲ ᑲᥙ́s𝗊ᥙᥱძᥲ ძᥱ ᥡᥙ᥆𝗍ᥙᑲᥱ.`, m)

  await conn.reply(m.chat, '⏳ 𝙱ᥙsᥴᥲᥒძ᥆... ᥱsᥣᥲ ᥴᥙᥱᥣ᥊ 🛰️', m)

  const results = await yts(text)
  const videos = results.videos.slice(0, 5) // solo los primeros 5

  if (!videos.length) return conn.reply(m.chat, '❌ ᑲᥙ́s𝗊ᥙᥱძᥲ sᥱᥒ ɾᥱsᥙᥣሼᥲძ᥆...', m)

  for (let video of videos) {
    const { title, timestamp, views, ago, author, url, thumbnail } = video

    const caption = `📌 *${title}*\n\n` +
      `👤 *Canal:* ${author.name}\n` +
      `⏱️ *Duración:* ${timestamp}\n` +
      `📆 *Publicado:* ${ago}\n` +
      `👁️ *Vistas:* ${views}\n` +
      `🔗 *Enlace:* ${url}`

    const buttons = [
      { buttonId: `${usedPrefix}ytmp3 ${url}`, buttonText: { displayText: '🎧 Audio (MP3)' }, type: 1 },
      { buttonId: `${usedPrefix}ytmp4 ${url}`, buttonText: { displayText: '🎥 Video (MP4)' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      footer: '📽️ Resultado de YouTube',
      buttons,
      headerType: 4
    }, { quoted: m })
  }
}

handler.help = ['ytsearch <texto>']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler