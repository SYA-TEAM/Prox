import yts from 'yt-search'
import axios from 'axios'
const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { text, conn, command }) => {
  if (!text) return conn.reply(m.chat, '🍭 *Por favor, ingresa una búsqueda de YouTube.*', m)

  await m.react('🔎')
  conn.reply(m.chat, '*⏳ Buscando resultados, por favor espera...*', m)

  let results = await yts(text)
  let videos = results.videos.slice(0, 5)

  let cards = []

  for (const v of videos) {
    let thumb = v.thumbnail
    let imageMsg = await createImageMessage(thumb, conn)

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `🎵 ${v.title}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: `⏱️ ${v.timestamp} • 👀 ${v.views} • 📆 ${v.ago}`
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: v.author.name,
        hasMediaAttachment: true,
        imageMessage: imageMsg
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [{
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "Ver más",
            url: v.url
          })
        }]
      })
    })
  }

  const carouselMessage = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `🔍 Resultados para: *${text}*`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: '✦ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴡɪʀᴋ ❆'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, carouselMessage.message, { messageId: carouselMessage.key.id })
}

async function createImageMessage(url, conn) {
  const { imageMessage } = await generateWAMessageFromContent('', {
    image: { url }
  }, { upload: conn.waUploadToServer })
  return imageMessage
}

handler.help = ['ytbuscar', 'ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler