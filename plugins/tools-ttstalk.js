import axios from 'axios'

let handler = async (m, { usedPrefix, command, conn, text }) => {
  if (!text) return m.reply(`🔎 Por favor, ingresa un usuario de tiktok para Stalkear.\n> *\`Ejemplo:\`* ${usedPrefix + command} mrbeast`);

  try {
    await m.react('⏳');

    let ress = await axios.get(`https://api.koboo.my.id/api/stalk/tiktok?username=${text}`)
    let res = ress.data

    if (res.status !== 200) throw 'Error! No se encontró el usuario. Asegúrate de escribirlo correctamente.'

    let user = res.result.user
    let stats = res.result.stats
    let profileTab = user.profileTab

    let teks = `\`\`\`❁ STALK - TIKTOK\`\`\`\n
*❀ 𝖭𝖮𝖬𝖡𝖱𝖤 :* ${user.nickname}
*❀ 𝖴𝖲𝖴𝖠𝖱𝖨𝖮 :* ${user.uniqueId}
*❀ 𝖨𝖣 :* ${user.id}
*❀ 𝖲𝖤𝖦𝖴𝖨𝖣𝖮𝖱𝖤𝖲 :* ${stats.followerCount}
*❀ 𝖲𝖨𝖦𝖴𝖨𝖤𝖭𝖣𝖮 :* ${stats.followingCount}
*❀ 𝖬𝖤 𝖦𝖴𝖲𝖳𝖠𝖲 𝖳𝖮𝖳𝖠𝖫𝖤𝖲 :* ${stats.heartCount}
*❀ 𝖵𝖨𝖣𝖤𝖮𝖲 :* ${stats.videoCount}
*❀ 𝖠𝖬𝖨𝖦𝖮𝖲 :* ${stats.friendCount}
*❀ 𝖣𝖤𝖲𝖢𝖱𝖨𝖯𝖢𝖨𝖮́𝖭 :* ${user.signature || 'Sin descripción'}
*◦ REGIÓN :* ${user.region || 'Desconocida'}
*◦ CUENTA PRIVADA :* ${user.privateAccount ? '🔒 Sí' : '🔓 No'}
*◦ VERIFICADO :* ${user.verified ? '✅ Sí' : '❌ No'}
*◦ CUENTA COMERCIAL :* ${user.commerceUserInfo.commerceUser ? '🛒 Sí' : '❌ No'}
*◦ DESCARGAS PERMITIDAS :* ${user.downloadSetting === 3 ? '✅ Sí' : '❌ No'}
*◦ EXPANDIR PLAYLIST :* ${user.canExpPlaylist ? '✅ Sí' : '❌ No'}
*◦ PESTAÑA DE MÚSICA :* ${profileTab.showMusicTab ? '✅ Sí' : '❌ No'}
*◦ PESTAÑA DE PREGUNTAS :* ${profileTab.showQuestionTab ? '✅ Sí' : '❌ No'}
*◦ PESTAÑA DE PLAYLIST :* ${profileTab.showPlayListTab ? '✅ Sí' : '❌ No'}
*◦ ORGANIZACIÓN :* ${user.isOrganization ? '🏢 Sí' : '❌ No'}
*◦ LENGUAJE :* ${user.language || 'Desconocido'}`

    await conn.sendMessage(m.chat, { image: { url: user.avatarLarger }, caption: teks }, { quoted: m })
    await m.react('✅')

  } catch (err) {
    m.reply('*❌ Error: No se encontró el usuario o la API falló. Intenta nuevamente.*')
  }
}

handler.help = ['tiktokstalk *<usuario>*']
handler.tags = ['stalk']
handler.command = ['ttstalk', 'tiktokstalk']

export default handler