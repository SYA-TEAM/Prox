import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

// Se añade un método 'getRandom' al prototipo de Array para poder usarlo en cualquier arreglo.
Array.prototype.getRandom = function() {
  return this[Math.floor(Math.random() * this.length)]
}

// Se mueve la definición de getBuffer fuera del handler para que no se redeclare con cada mensaje.
global.getBuffer = async function getBuffer(url, options) {
  try {
    options = options || {}
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'User-Agent': 'GoogleBot',
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (e) {
    console.log(`Error : ${e}`)
  }
}

var handler = m => m
handler.all = async function (m) {

  // Es mejor práctica definir las funciones auxiliares antes de usarlas.
  async function getRandomChannel() {
    let randomIndex = Math.floor(Math.random() * canalIdM.length)
    let id = canalIdM[randomIndex]
    let name = canalNombreM[randomIndex]
    return { id, name }
  }

  global.creador = 'Wa.me/5212202410659'
  global.ofcbot = `${conn.user.jid.split('@')[0]}`
  global.namechannel = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
  global.namechannel2 = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
  global.namegrupo = 'ᰔᩚ ᥡᥙkі sᥙ᥆ᥙ • ᥆𝖿іᥴіᥲᥣ ❀'
  global.namecomu = 'ᰔᩚ ᥡᥙkіᑲ᥆𝗍-mძ • ᥴ᥆mᥙᥒі𝗍ᥡ ❀'
  global.listo = '❀ *Aquí tienes ฅ^•ﻌ•^ฅ*'
  global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  global.canalIdM = ["120363402846939411@newsletter", "120363402846939411@newsletter"]
  global.canalNombreM = ["✦ ᴀɴʏᴀ ғᴏʀɢᴇʀ ٭ ᴄʜᴀɴɴᴇʟ ❀", "✦ ᴀɴʏᴀ ғᴏʀɢᴇʀ ٭ ᴄʜᴀɴɴᴇʟ ❀"]
  global.channelRD = await getRandomChannel()

  global.d = new Date(new Date().getTime() + 3600000)
  global.locale = 'es'
  global.dia = d.toLocaleDateString(global.locale, { weekday: 'long' })
  global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' })
  global.mes = d.toLocaleDateString('es', { month: 'long' })
  global.año = d.toLocaleDateString('es', { year: 'numeric' })
  global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'
  global.msm = '⚠︎'

  global.emoji = '✿'
  global.emoji2 = '✦'
  global.emoji3 = '𖤐'
  global.emoji4 = '✰'
  global.emoji5 = '❐'
  global.emojis = [global.emoji, global.emoji2, global.emoji3, global.emoji4].getRandom()

  global.wait = '❐ Espera un momento, soy lenta...';
  global.waitt = '❐ Espera un momento, soy lenta...';
  global.waittt = '❐ Espera un momento, soy lenta...';
  global.waitttt = '❐ Espera un momento, soy lenta...';

  var canal = 'https://whatsapp.com/channel/0029VbAfPu9BqbrEMFWXKE0d'
  var comunidad = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
  var git = 'https://github.com/The-King-Destroy'
  var github = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot'
  let correo = 'jisepe2933@tiongle.com'
  global.redes = [canal, comunidad, git, github, correo].getRandom()

  let category = "imagen"
  const db = './src/database/db.json'
  const db_ = JSON.parse(fs.readFileSync(db))
  const random = Math.floor(Math.random() * db_.links[category].length)
  const randomlink = db_.links[category][random]
  const response = await fetch(randomlink)
  const rimg = await response.buffer()
  global.icons = rimg

  var ase = new Date();
  var hour = ase.getHours();
  switch (hour) {
    case 0: case 1: case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;
    case 3: case 4: case 5: case 6: case 7: case 8: case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break;
    case 10: case 11: case 12: case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break;
    case 14: case 15: case 16: case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break;
    case 18: case 19: case 20: case 21: case 22: case 23: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;
  }
  global.saludo = hour;

  global.nombre = m.pushName || 'Anónimo'
  global.taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
  var more = String.fromCharCode(8206)
  global.readMore = more.repeat(850)

  // Asumiendo que 'botname' y 'dev' están definidos globalmente en otro archivo.
  global.packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n☁︎ Usuario: ${global.nombre}\n✎ Bot: ${global.botname}\n✦ Fecha: ${global.fecha}\n☕︎︎ Hora: ${global.tiempo}`;
  global.packsticker2 = `\n°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\n${global.dev}`

  global.fkontak = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {})
    },
    message: {
      'contactMessage': {
        'displayName': `${global.nombre}`,
        'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.nombre},;;;\nFN:${global.nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        'jpegThumbnail': null,
        thumbnail: null,
        sendEphemeral: true
      }
    }
  }

  // Corregido: La sintaxis original era inválida.
  // Ahora es un solo objeto y se usa con el contexto de quoted message.
  // Ejemplo de uso: conn.sendMessage(m.chat, { text: 'Hola' }, { quoted: global.fake })
  global.fake = {
    key: {
      remoteJid: 'status@broadcast',
      participant: '0@s.whatsapp.net',
      fromMe: false,
      id: 'YOUR_MESSAGE_ID' // Deberías generar un ID de mensaje único si es necesario
    },
    message: {
      'extendedTextMessage': {
        'text': 'Anya - Bot',
        'title': 'Anya-bot',
        'jpegThumbnail': await getBuffer(global.icons) // Reutilizamos el ícono
      }
    },
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        newsletterName: channelRD.name,
        serverMessageId: -1
      }
    }
  };

  global.icono = [
    'https://qu.ax/LfnqV.jpg',
  ].getRandom()

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363402846939411@newsletter',
        serverMessageId: 100,
        newsletterName: '✿ 𝖲𝖸𝖠 𝖳𝖤𝖠𝖬 - © 𝟤𝟢𝟤𝟧 ❀',
      },
      externalAdReply: {
        showAdAttribution: true,
        title: global.wm,
        body: '✦ ᴀɴʏᴀ ғᴏʀɢᴇʀ ✦',
        mediaUrl: 'https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau',
        description: null,
        previewType: 'PHOTO',
        thumbnailUrl: 'https://files.catbox.moe/8pux7u.jpg',
        sourceUrl: 'https://wirksi-box.vercel.app',
        mediaType: 2,
        renderLargerThumbnail: false,
      },
    },
  };
}

export default handler;
