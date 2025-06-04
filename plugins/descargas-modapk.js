import { search, download } from 'aptoide-scraper'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el nombre de la apk para descargarlo.`, m)

  try {
    await m.react(rwait)
    conn.reply(m.chat, `${emoji} Descargando su aplicación, espere un momento...`, m)

    let searchA = await search(text)
    let data5 = await download(searchA[0].id)

    let txt = `*乂  APK 乂*\n\n`
    txt += `➡︎ *Nombre* : ${data5.name}\n`
    txt += `➡︎ *Package* : ${data5.package}\n`
    txt += `➡︎ *Update* : ${data5.lastup}\n`
    txt += `➡︎ *Peso* : ${data5.size}`

    await conn.sendMessage(m.chat, {
      image: { url: data5.icon },
      caption: txt,
      footer: '📲 APK desde Aptoide',
      buttons: [
        { buttonId: `${usedPrefix}descargarapk ${encodeURIComponent(data5.dllink)}|${data5.name}`, buttonText: { displayText: '📦 Descargar APK' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })

    await m.react(done)

  } catch {
    return conn.reply(m.chat, `${msm} Ocurrió un fallo...`, m)
  }
}

handler.tags = ['descargas']
handler.help = ['apkmod']
handler.command = ['apk', 'modapk', 'aptoide']
handler.group = true
handler.register = true
handler.coin = 33

export default handler