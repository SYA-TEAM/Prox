/* Codigo hecho por @Fabri115 y mejorado por BrunoSobrino */

import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix }) => {

await conn.reply(m.chat, `${emoji2} Iniciando proceso de eliminación de todos los archivos de sesión, excepto el archivo creds.json...`, m)
m.react(rwait)

let sessionPath = `./${sessions}/`

try {
  if (!existsSync(sessionPath)) {
    return await conn.reply(m.chat, `${emoji} La carpeta está vacía o no existe.`, m)
  }

  let files = await fs.readdir(sessionPath)
  let filesDeleted = 0

  for (const file of files) {
    if (file !== 'creds.json') {
      await fs.unlink(path.join(sessionPath, file))
      filesDeleted++
    }
  }

  if (filesDeleted === 0) {
    await conn.reply(m.chat, `${emoji2} No se encontraron archivos a eliminar. Solo está creds.json.`, m)
  } else {
    m.react(done)
    await conn.reply(m.chat, `${emoji} Se eliminaron ${filesDeleted} archivos de sesión, excepto el archivo creds.json.`, m)
    conn.reply(m.chat, `${emoji} *¡Hola! ¿logras verme?*`, m)
  }

} catch (err) {
  console.error('Error al leer la carpeta o los archivos de sesión:', err)
  await conn.reply(m.chat, `${msm} Ocurrió un fallo al procesar los archivos.`, m)
}
}

handler.help = ['dsowner']
handler.tags = ['owner']
handler.command = ['delai', 'dsowner', 'clearallsession']
handler.rowner = true

export default handler