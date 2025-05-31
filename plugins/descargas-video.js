import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply('🌸 Ingresa el nombre o enlace del video\n\nEjemplo: *.video Shakira Acróstico*')

  try {
    const search = await yts(text)
    const video = search.videos[0]
    if (!video) return m.reply('❌ No se encontró ningún video.')

    const info = `🎬 *Título:* ${video.title}
🕒 *Duración:* ${video.timestamp}
📺 *Canal:* ${video.author.name}
🔗 *Enlace:* ${video.url}`

    // Enviar imagen con descripción
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: info
    }, { quoted: m })

    // Descargar y enviar el video como documento
    const downloadUrl = `https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`

    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${video.title}.mp4`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al procesar el comando.')
  }
}

handler.command = /^video$/i
handler.help = ['video <nombre o enlace>']
handler.tags = ['descargas']

export default handler