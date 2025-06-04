import yts from 'yt-search'

var handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `🔍 ιᥒgrᥱsᥲ ᥙᥒᥲ ᑲᥙ́s𝗊ᥙᥱძᥲ ძᥱ ᥡᥙ᥆𝗍ᥙᑲᥱ.`, m)

  await conn.reply(m.chat, '⏳ 𝙱ᥙsᥴᥲᥒძ᥆... ᥱsᥣᥲ ᥴᥙᥱᥣ᥊ 🛰️', m)

  const results = await yts(text)
  const videos = results.videos.slice(0, 5)

  if (!videos.length) return conn.reply(m.chat, '❌ ᑲᥙ́s𝗊ᥙᥱძᥲ sᥱᥒ ɾᥱsᥙᥣሼᥲძ᥆...', m)

  let caption = `🎬 *Resultados encontrados:*\n\n`

  const buttons = []

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i]
    caption += `*${i + 1}.* ${v.title}\n` +
               `   ⏱️ ${v.timestamp} | 👁️ ${v.views} | 📆 ${v.ago}\n` +
               `   👤 ${v.author.name}\n\n`
    buttons.push({
      buttonId: `${usedPrefix}ytmp3 ${v.url}`,
      buttonText: { displayText: `${i + 1}️⃣ Audio MP3` },
      type: 1
    })
  }

  await conn.sendMessage(m.chat, {
    text: caption.trim(),
    footer: '📽️ Resultado de YouTube',
    buttons,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['ytsearch <texto>']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler