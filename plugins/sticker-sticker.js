import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {
  let stiker = false

  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && ((q.msg || q).seconds || 0) > 20) {
        return m.reply(`💖 El video no puede durar más de 20 segundos...`)
      }

      const img = await q.download?.()
      if (!img) {
        return conn.reply(m.chat, `🌷 Para hacer un sticker, por favor envía una *imagen o video* ✨`, m)
      }

      try {
        const userId = m.sender
        const user = global.db.data.users[userId] || {}
        const texto1 = user.text1 || global.packsticker
        const texto2 = user.text2 || global.packsticker2

        stiker = await sticker(img, false, texto1, texto2)
      } catch (e) {
        let out
        if (/webp/.test(mime)) out = await webp2png(img)
        else if (/image/.test(mime)) out = await uploadImage(img)
        else if (/video/.test(mime)) out = await uploadFile(img)

        if (typeof out !== 'string') out = await uploadImage(img)

        stiker = await sticker(false, out, global.packsticker, global.packsticker2)
      }

    } else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)
      } else {
        return m.reply(`⚠️ El enlace no es válido. Asegúrate de que sea una imagen o video en formato correcto.`)
      }
    }

  } catch (e) {
    console.error(e)
  } finally {
    if (stiker) {
      conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    } else {
      return conn.reply(m.chat, `🍡 Aún no puedo hacer el sticker...\n📎 Por favor, mándame una *imagen o video* primero 🤍`, m)
    }
  }
}

handler.help = ['stiker <imagen>', 'sticker <url>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return /^https?:\/\/.+\.(jpe?g|gif|png|webp|mp4)$/i.test(text)
}
