import { search, download } from 'aptoide-scraper'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  let query = text || args[0]

  if (!query) return conn.reply(m.chat, '📦 Ingresa el nombre de la APK que deseas buscar.', m)

  // Verificar si es ejecución de botón con prefijo especial
  if (query.startsWith('apkdl_')) {
    let id = query.split('_')[1]
    if (!global.apksTemp || !global.apksTemp[id]) return conn.reply(m.chat, '❌ Descarga expirada o no encontrada. Usa el comando de búsqueda nuevamente.', m)

    let appInfo = global.apksTemp[id]
    await m.react('⬇️')

    if (appInfo.size.includes('GB') || parseFloat(appInfo.size.replace(' MB', '')) > 999) {
      return conn.reply(m.chat, '⚠️ El archivo es demasiado grande para enviarlo por WhatsApp.', m)
    }

    await conn.sendMessage(m.chat, {
      document: { url: appInfo.dllink },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${appInfo.name}.apk`,
      caption: `✅ *Descarga completa:* ${appInfo.name}`
    }, { quoted: m })

    await m.react('✅')
    delete global.apksTemp[id]
    return
  }

  try {
    await m.react('🔍')
    let results = await search(query)

    if (!results.length) return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m)

    let appInfo = await download(results[0].id)

    // Crear ID único temporal para el botón
    let tempId = new Date().getTime().toString(36)
    global.apksTemp = global.apksTemp || {}
    global.apksTemp[tempId] = appInfo

    let txt = `*📦 Resultado de búsqueda:*\n\n`
    txt += `📌 *Nombre:* ${appInfo.name}\n`
    txt += `📦 *Paquete:* ${appInfo.package}\n`
    txt += `📅 *Última actualización:* ${appInfo.lastup}\n`
    txt += `📁 *Tamaño:* ${appInfo.size}`

    let buttons = [
      { buttonId: `${usedPrefix}${command} apkdl_${tempId}`, buttonText: { displayText: '📥 Descargar APK' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      image: { url: appInfo.icon },
      caption: txt,
      footer: '🌐 Aptoide Downloader',
      buttons,
      headerType: 4
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Ocurrió un error al buscar o descargar la APK.', m)
  }
}

handler.help = ['apk <nombre>']
handler.tags = ['descargas']
handler.command = ['apk', 'modapk', 'aptoide']
handler.register = true
handler.group = false
handler.coin = 33

export default handler