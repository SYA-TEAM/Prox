import { search, download } from 'aptoide-scraper'

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, '📦 Ingrese el nombre de la APK para buscar.', m)

  try {
    await m.react('🔎') // Reacción inicial de búsqueda
    const searchResults = await search(text)

    if (!searchResults.length) return conn.reply(m.chat, '❌ No se encontraron resultados.', m)

    const appInfo = await download(searchResults[0].id)

    let info = `*📦 Resultado de búsqueda:*\n\n`
    info += `📌 *Nombre:* ${appInfo.name}\n`
    info += `📦 *Package:* ${appInfo.package}\n`
    info += `📅 *Última actualización:* ${appInfo.lastup}\n`
    info += `📁 *Tamaño:* ${appInfo.size}`

    const buttons = [
      { buttonId: `${usedPrefix}apkdescarga ${appInfo.package}`, buttonText: { displayText: '👤 Descargar APK' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      image: { url: appInfo.icon },
      caption: info,
      footer: '🌐 Aptoide Downloader',
      buttons,
      headerType: 4
    }, { quoted: m })

    // Guardamos en memoria temporal el enlace de descarga para el siguiente comando
    global.aptoide_temp = global.aptoide_temp || {}
    global.aptoide_temp[m.sender] = appInfo

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '⚠️ Ocurrió un error al buscar la aplicación.', m)
  }
}

// Segundo comando que maneja la descarga
const downloadHandler = async (m, { conn }) => {
  try {
    const info = global.aptoide_temp?.[m.sender]
    if (!info) return conn.reply(m.chat, '📦 No hay ninguna descarga pendiente. Usa el comando de búsqueda primero.', m)

    await m.react('⬇️') // Reacción de descarga

    if (info.size.includes('GB') || parseFloat(info.size.replace(' MB', '')) > 999) {
      return conn.reply(m.chat, '⚠️ El archivo es demasiado pesado para enviarlo por WhatsApp.', m)
    }

    await conn.sendMessage(m.chat, {
      document: { url: info.dllink },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${info.name}.apk`,
      caption: `✅ *Descarga completa: ${info.name}*`,
    }, { quoted: m })

    await m.react('✅') // Reacción de éxito
    delete global.aptoide_temp[m.sender] // Eliminamos el registro

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Ocurrió un error al enviar la APK.', m)
  }
}

handler.command = ['apk', 'modapk', 'aptoide']
handler.help = ['apk <nombre>']
handler.tags = ['descargas']
handler.register = true
handler.group = false
handler.coin = 33

// Segundo handler
downloadHandler.command = ['apkdescarga']
downloadHandler.tags = ['descargas']
downloadHandler.register = true
downloadHandler.group = false
downloadHandler.coin = 0

export default [handler, downloadHandler]