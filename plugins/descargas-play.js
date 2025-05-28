import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '❀ Por favor, ingresa el nombre de la música a descargar.', m)
    }

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2 || ytplay2.length == 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    title = title || 'no encontrado'
    thumbnail = thumbnail || 'no encontrado'
    timestamp = timestamp || 'no encontrado'
    views = views || 'no encontrado'
    ago = ago || 'no encontrado'
    url = url || 'no encontrado'
    author = author || 'no encontrado'

    const vistas = formatViews(views)
    const canal = author.name ? author.name : 'Desconocido'
    const infoMessage = `⧼✐⧽ 𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈 *<${title}>*\n\n> ✿ Canal » *${canal}*\n> ✿ Vistas » *${vistas}*\n> ✿ Duración » *${timestamp}*\n> ✿ Publicado » *${ago}*\n> ✿ Link » ${url}`

    const thumb = (await conn.getFile(thumbnail))?.data
    const JT = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: wm,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: redes,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, JT)

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const result = api.result?.download?.url
        if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')
        await conn.sendMessage(m.chat, {
          audio: { url: result },
          fileName: `${api.result.title}.mp3`,
          mimetype: 'audio/mpeg'
        }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.', m)
      }
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const res = await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${url}`)
        const json = await res.json()

        if (!json || !json.result?.url) throw new Error('⚠ No se pudo obtener el enlace de descarga.')

        const downloadUrl = json.result.url
        const titleVideo = json.result.title || title
        await conn.sendFile(m.chat, downloadUrl, `${titleVideo}.mp4`, title, m)
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.', m)
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['yta', 'ytmp3', 'mp4', 'play2']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}