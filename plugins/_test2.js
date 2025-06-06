import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `⪩ Por favor, ingresa el nombre o link del video a descargar.`, m)
    }

    await m.react('🕓') // Reacción rápida al comenzar

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]  
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    } 

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2  
    if (!ytplay2 || ytplay2.length == 0) {
      return m.reply('✰ No se encontraron resultados para tu búsqueda.')
    }

    const { title, url } = ytplay2
    if (!url) return m.reply('✰ No se pudo obtener el enlace del video.')

    try {
      const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=video&quality=480p&apikey=GataDios`)
      const json = await response.json()

      if (!json?.data?.url) {
        return conn.reply(m.chat, '⚠ No se pudo obtener el enlace de descarga del video.', m)
      }

      await conn.sendFile(m.chat, json.data.url, `${title}.mp4`, null, m)
      await m.react('✅') // Confirmación exitosa
    } catch (e) {
      await m.react('❌')
      return conn.reply(m.chat, '> ✢ No se pudo enviar el video. Esto puede pasar por varias razones: enlace inválido, video pesado o duración mayor a 45 minutos. Intenta con otro video.', m)
    }
  } catch (error) {
    await m.react('❌')
    return m.reply(`⚠︎ Ocurrió un error: ${error.message || error}`)
  }
}

handler.command = handler.help = ['ytmp4']
handler.tags = ['descargas']
handler.group = false

export default handler
