import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🌸 Ingresa el nombre o enlace del video\n\nEjemplo: *.video Shakira Acróstico*')

  try {
    const search = await yts(text)
    const video = search.videos[0]
    if (!video) return m.reply('❌ No se encontró ningún video.')

    const info = `🎬 *Título:* ${video.title}
🕒 *Duración:* ${video.timestamp}
📺 *Canal:* ${video.author.name}
🔗 *Enlace:* ${video.url}`

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: info
    }, { quoted: m })

    const downloadUrl = `https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`

    m.reply('⏳ Descargando el video, espera un momento...')

    const res = await fetch(downloadUrl)
    if (!res.ok) throw '❌ Error al descargar el video.'
    const buffer = await res.buffer()

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: `${video.title}.mp4`,
      caption: `🎬 ${video.title}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al enviar el video.')
  }
}

handler.command = ['video']
handler.help = ['video <nombre o enlace>']
handler.tags = ['descargas']

export default handler