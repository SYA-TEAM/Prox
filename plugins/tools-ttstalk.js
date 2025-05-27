import axios from 'axios'

let handler = async (m, { usedPrefix, command, conn, text }) => {
if (!text) return m.reply(`(｡•́︿•̀｡) Porfis, ingresa un usuario de TikTok para ver su perfil~\n✿ Ejemplo: \`${usedPrefix + command} mrbeast\``);

try {
await m.react('⏱️');

let ress = await axios.get(`https://api.koboo.my.id/api/stalk/tiktok?username=${text}`)  
let res = ress.data  

if (res.status !== 200) throw '｡ﾟ･ (>﹏<) ･ﾟ｡ ¡Error! No se encontró el usuario. Asegúrate de escribirlo bien, ¿sí?~'  

let user = res.result.user  
let stats = res.result.stats  
let profileTab = user.profileTab  

let teks = `┏━━━━°❀•°:💗:°•❀°━━━━┓
          ʚ STALK TIKTOK ɞ
┗━━━━°❀•°:💗:°•❀°━━━━┛

•ꕤ Nombre: ${user.nickname}
•ꕤ Usuario: @${user.uniqueId}
•ꕤ ID: ${user.id}
•ꕤ Seguidores: ${stats.followerCount}
•ꕤ Siguiendo: ${stats.followingCount}
•ꕤ Me gusta: ${stats.heartCount}
•ꕤ Videos: ${stats.videoCount}
•ꕤ Amigos: ${stats.friendCount}
•ꕤ Descripción: ${user.signature || 'Sin descripción'}

∘ Región: ${user.region || 'Desconocida'}
∘ Cuenta privada: ${user.privateAccount ? '🔒 Sí' : '🔓 No'}
∘ Verificado: ${user.verified ? '✅ Sí' : '❌ No'}
∘ Comercial: ${user.commerceUserInfo.commerceUser ? '🛒 Sí' : '❌ No'}
∘ Descargas permitidas: ${user.downloadSetting === 3 ? '✅ Sí' : '❌ No'}
∘ Playlist expandible: ${user.canExpPlaylist ? '✅ Sí' : '❌ No'}
∘ Pestaña de música: ${profileTab.showMusicTab ? '✅ Sí' : '❌ No'}
∘ Pestaña de preguntas: ${profileTab.showQuestionTab ? '✅ Sí' : '❌ No'}
∘ Pestaña de playlist: ${profileTab.showPlayListTab ? '✅ Sí' : '❌ No'}
∘ Organización: ${user.isOrganization ? '🏢 Sí' : '❌ No'}
∘ Lenguaje: ${user.language || 'Desconocido'}`

await conn.sendMessage(m.chat, { image: { url: user.avatarLarger }, caption: teks }, { quoted: m })  
await m.react('✅')

} catch (err) {
m.reply('(｡•́︿•̀｡) ❌ No se pudo encontrar el usuario o la API falló~ ¡Intenta otra vez, onegai!')
}
}

handler.help = ['tiktokstalk <usuario>']
handler.tags = ['stalk']
handler.command = ['ttstalk', 'tiktokstalk']

export default handler