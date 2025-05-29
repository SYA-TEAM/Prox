import { promises as fs } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'crow': '👑「 MENUS RE」👑',
  'main': '「INFO」😼',
  'teclado': '「TECLADO REMBOT」😼☁️',
  'buscador': '「BUSQUEDAS」😼',
  'fun': '「JUEGOS」👾',
  'serbot': '「SUB BOTS」😼',
  'rpg': '「RPG」😼',
  'gacha': '「ROLLWAIFUS」😼',
  'rg': '「REGISTRO」😼',
  'sticker': '「STICKERS」😼',
  'emox': '「ANIMES」😼',
  'database': '「DATABASE」😼',
  'grupo': '「GRUPOS」😼',
  'nable': '「ON / OFF」',
  'descargas': '「DESCARGAS」😼',
  'tools': '「HERRAMIENTAS」😼',
  'info': '「INFORMACIÓN」😂',
  'owner': '「CREADOR」😼',
  'logos': '「EDICIÓN LOGOS」😼'
}

const vid = ['https://files.catbox.moe/9jh4vr.mp4']

const defaultMenu = {
  before: `
 ┇◦✦◦✦◦✦◦✦◦◦✦◦◦✦◦◦✦◦◦✦◦◦┋:̖́

“ ➪ 𝗛ola %name ❒” Soy Anya Forger 🩵✨

╭꒱≡≡≡≡≡╡💌𝑰𝑵𝑭𝑶 - 𝑩𝑶𝑻💌╞≡≡≡≡꒱
┊ ✿ 𝘾𝙡𝙞𝙚𝙣𝙩𝙚: %name
┊ 💫 𝙀𝙭𝙥: %exp
┊ 🌟 𝙀𝙨𝙩𝙧𝙚𝙡𝙡𝙖𝙨: %estrellas
┊ 🥇 𝙉𝙞𝙫𝙚𝙡: %level
┊ 🎖️ 𝙍𝙖𝙣𝙜𝙤: %role
╰━━━━━━━━━━━━━━━━━♡

%readmore

╭꒱≡≡≡≡≡╡🌈𝑰𝑵𝑭𝑶 - 𝑼𝑺𝑬𝑹🌈╞≡≡≡≡꒱
┊ ✿ 𝖡𝗈𝗍 » %botrole
┊ ✨ 𝙈𝙤𝙙𝙤: Privado VIP
┊ 💌 𝘽𝙖𝙞𝙡𝙚𝙮𝙨: Multi Device
┊ 🪐 𝙏𝙞𝙚𝙢𝙥𝙤 𝘼𝙘𝙩𝙞𝙫𝙖: %uptime
┊ 😻 𝙐𝙨𝙪𝙖𝙧𝙞𝙤𝙨: %totalreg
╰━━━━━━━━━━━━━━━━━♡

♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡

🎀 𝐂 𝐨 𝐦 𝐚 𝐧 𝐝 𝐨 𝐬 🎀`.trimStart(),

  header: '🍒 %category 🍒\n———————————————',
  body: '💗 %cmd',
  footer: '━━━━━━━━━━━━━━━━━━━\n',
  after: '🍓 𝙍𝙚𝙘𝙪𝙚𝙧𝙙𝙖: Usa los comandos con amor 💕'
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await fs.readFile(join(__dirname, '../package.json')).catch(() => '{}')) || {}
    let { exp, estrellas, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(Date.now() + 3600000)
    let locale = 'es'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(() => resolve(_uptime), 1000)
      }) * 1
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      estrellas: plugin.estrellas,
      premium: plugin.premium,
      enabled: !plugin.disabled
    }))

    for (let plugin of help) {
      for (let tag of plugin.tags || []) {
        if (!(tag in tags)) tags[tag] = tag
      }
    }

    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + help
          .filter(menu => menu.tags.includes(tag))
          .map(menu => menu.help.map(help => body.replace(/%cmd/g, menu.prefix ? help : _p + help)).join('\n'))
          .join('\n') + footer
      }),
      after
    ].join('\n')

    let botrole = (conn.user.jid === global.conn.user.jid) ? 'Principal' : 'Sub Bot'

    let replace = {
      '%': '%',
      p: _p,
      uptime,
      muptime,
      me: await conn.getName(conn.user.jid),
      botrole,
      taguser: '@' + m.sender.split('@')[0],
      npmname: _package.name || '',
      npmdesc: _package.description || '',
      version: _package.version || '',
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage || 'https://github.com',
      level,
      estrellas,
      name,
      week,
      date,
      dateIslamic,
      time,
      totalreg,
      rtotalreg,
      role,
      readmore
    }

    let text = _text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, name) => replace[name])

    await m.react('🌸')
    await conn.sendMessage(m.chat, {
      video: { url: vid[Math.floor(Math.random() * vid.length)] },
      caption: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        externalAdReply: {
          title: '🌟 MENÚ 🌟',
          body: 'Dev Wirk 💕',
          thumbnailUrl: 'https://i.imgur.com/VRt2QYg.jpeg',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: 'https://github.com'
        }
      }
    })

  } catch (e) {
    console.error(e)
    m.reply('Ocurrió un error mostrando el menú💔')
  }
}

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const readMore = String.fromCharCode(8206).repeat(4001)

handler.command = ['menutest']
export default handler