import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '❀ Por favor, ingresa el nombre o link de la música a descargar.', m)
    }

    const videoIdMatch = text.match(youtubeRegexID)
    const query = videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text
    const searchResult = await yts(query)

    let video = null
    if (videoIdMatch) {
      const videoId = videoIdMatch[1]
      video = searchResult.all.find(v => v.videoId === videoId) || searchResult.videos.find(v => v.videoId === videoId)
    } else {
      video = searchResult.all?.[0] || searchResult.videos?.[0]
    }

    if (!video) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = video

    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'
    const infoMessage = `⧼✐⧽ 𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈 *<${title}>*\n\n> ✿ Canal » *${canal}*\n> ✿ Vistas » *${vistas}*\n> ✿ Duración » *${timestamp || 'Desconocido'}*\n> ✿ Publicado » *${ago || 'Desconocido'}*\n> ✿ Link » ${url}`

    const thumb = (await conn.getFile(thumbnail))?.data
    const JT = {
      contextInfo: {
        externalAdReply: {
          title,
          body: botname,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, JT, m, JT)

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const api = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
        const json = await api.json()
        const audioUrl = json.result?.download?.url
        if (!audioUrl) throw new Error('⚠ El enlace de audio no se generó correctamente.')
        await conn.sendMessage(m.chat, {
          audio: { url: audioUrl },
          fileName: `${json.result.title}.mp3`,
          mimetype: 'audio/mpeg'
        }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio.', m)
      }
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
        const json = await response.json()
        if (!json?.data?.url) throw new Error('⚠ No se pudo obtener el enlace del video.')
        await conn.sendFile(m.chat, json.data.url, `${json.title}.mp4`, title, rcanal)
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede que sea muy pesado o haya ocurrido un error.', m)
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (!views) return 'No disponible'
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}