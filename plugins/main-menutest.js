Import PhoneNumber from 'awesome-phonenumber';
let handler = async (m, { conn, args }) => {
const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });

function banderaEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = [...countryCode.toUpperCase()]
    .map(char => 0x1F1E6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

const number = m.sender.replace('@s.whatsapp.net', '');
const phoneInfo = PhoneNumber('+' + number);
const countryCode = phoneInfo.getRegionCode('international');
const bandera = banderaEmoji(countryCode) || '🌐';
const pais = regionNames.of(countryCode) || 'Desconocido';
const mundo = `${bandera} ${pais}`;
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    // ୨୧ ⋆˙ Kawaii elements chosen for the redesign (narrower) ⋆˙୨୧
    let txt = `
ପ(๑•ᴗ•๑)ଓ ₊˚⊹♡ ¡Holii, @${userId.split('@')[0]}! Soy *${botname}* ૮₍｡´ᴖ ˔ ᴖ`｡₎ა

╭・ପ ♡ ┈┈┈┈┈ ♡ ଓ・╮
│ 🎀 Modo ﹕ Público
│ ✨ Bot ﹕ ${(conn.user.jid == global.conn.user.jid ? 'Principal ꒰ᐢ. .ᐢ꒱' : 'Prem ૮ • ﻌ - ა⁩')}
│ 🌸 Activa ﹕ ${uptime}
│ 💖 Usuaries ﹕ ${totalreg}
│ 🌟 Comandos ﹕ ${totalCommands}
│ 🌍 País ﹕ ${mundo}
│ 💻 Baileys ﹕ Multi Dev
╰・ପ ♡ ┈┈┈┈┈ ♡ ଓ・╯

🍓 Si quieres sub-bot: *#qr* o *#code* 🍰

୨୧┈૮₍´˶• . • ⑅ ₎ა *info-bot*┈୨୧
꒰ᐢ. .ᐢ꒱₊˚⊹ Chismecitos sobre mí~
｡ﾟﾟ･｡･ﾟﾟ｡･｡ﾟﾟ･｡･ﾟﾟ｡
🍥 *#help • #menu*
   🍰 ꒱ Mi lista de truquitos.
🍥 *#uptime • #runtime*
   🍰 ꒱ Cuánto llevo despierta.
🍥 *#sc • #script*
   🍰 ꒱ Mi secretito (código).
🍥 *#staff • #colaboradores*
   🍰 ꒱ Mis amiguis devs.
🍥 *#serbot • #serbot code*
   🍰 ꒱ ¡Conviértete en sub-bot! ✨
🍥 *#bots • #sockets*
   🍰 ꒱ Lista de sub-bots.
🍥 *#creador*
   🍰 ꒱ Contacta a mi creador.
🍥 *#status • #estado*
   🍰 ꒱ ¿Cómo me siento?
🍥 *#links • #grupos*
   🍰 ꒱ Nuestras casitas oficiales.
🍥 *#infobot • #infobot*
   🍰 ꒱ Más cositas sobre mí.
🍥 *#sug • #newcommand*
   🍰 ꒱ ¡Ideas para comandos!
🍥 *#p • #ping*
   🍰 ꒱ Mide mi velocidad.
🍥 *#reporte • #reportar*
   🍰 ꒱ Si algo falla, ¡dime!
🍥 *#sistema • #system*
   🍰 ꒱ Info de mi hosting.
🍥 *#speed • #speedtest*
   🍰 ꒱ Prueba de velocidad.
🍥 *#views • #usuarios*
   🍰 ꒱ Cuántos me usan.
🍥 *#funciones • #totalfunciones*
   🍰 ꒱ Todas mis habilidades.
🍥 *#ds • #fixmsgespera*
   🍰 ꒱ Limpieza mágica.
🍥 *#editautoresponder*
   🍰 ꒱ Enséñame a responder.

ฅ^•ﻌ•^ฅ ⊹ *buscadores* ⊹ ฅ^•ﻌ•^ฅ
૮ ・ﻌ・ა Buscando tesoros~
♡‧₊˚✩彡---✩彡˚₊‧♡
🎀 *#tiktoksearch • #tiktoks*
   ✨ ꒱ Videos de TikTok.
🎀 *#tweetposts*
   ✨ ꒱ Chismes de Twitter/X.
🎀 *#ytsearch • #yts*
   ✨ ꒱ Busca en YouTube.
🎀 *#githubsearch*
   ✨ ꒱ Genios de GitHub.
🎀 *#cuevana • #cuevanasearch*
   ✨ ꒱ Pelis/series en Cuevana.
🎀 *#google*
   ✨ ꒱ El sabelotodo Google.
🎀 *#pin • #pinterest*
   ✨ ꒱ Imágenes de Pinterest.
🎀 *#imagen • #image*
   ✨ ꒱ Buscador de imágenes.
🎀 *#animesearch • #animess*
   ✨ ꒱ Animes en Tioanime.
🎀 *#animei • #animeinfo*
   ✨ ꒱ Info de capis #animesearch.
🎀 *#infoanime*
   ✨ ꒱ Todo sobre anime/manga.
🎀 *#hentaisearch • #searchhentai*
   ✨ ꒱ Búsqueda H (๑>؂<๑).
🎀 *#xnxxsearch • #xnxxs*
   ✨ ꒱ Videos Xnxx (⁄ ⁄•⁄ω⁄•⁄ ⁄).
🎀 *#xvsearch • #xvideossearch*
   ✨ ꒱ Videos Xvideos (⁄ ⁄•⁄ω⁄•⁄ ⁄).
🎀 *#pornhubsearch • #phsearch*
   ✨ ꒱ Videos Pornhub (⁄ ⁄•⁄ω⁄•⁄ ⁄).
🎀 *#npmjs*
   ✨ ꒱ Paquetitos de npmjs.

૮꒰˶•˕•˶꒱ა˚˖ *descargas* ⁺˖૮꒰˶•˕•˶꒱ა
🍭 ¡Bajando cositas lindas! 🍭
₊˚ʚ ᗢ₊˚✧ ﾟ.₊˚ʚ ᗢ₊˚✧ ﾟ.
🍬 *#tiktok • #tt*
   💖 ꒱ Descarga TikToks.
🍬 *#mediafire • #mf*
   💖 ꒱ Baja de MediaFire.
🍬 *#pinvid • #pinvideo* + [enlace]
   💖 ꒱ Videos de Pinterest.
🍬 *#mega • #mg* + [enlace]
   💖 ꒱ Archivos de MEGA.
🍬 *#play • #play2* • #playaudio • #playvideo
   💖 ꒱ Música/video de YouTube.
🍬 *#ytmp3 • #ytmp4*
   💖 ꒱ YouTube a MP3/MP4 (URL).
🍬 *#fb • #facebook*
   💖 ꒱ Videos de Facebook.
🍬 *#twitter • #x* + [Link]
   💖 ꒱ Descarga de Twitter/X.
🍬 *#ig • #instagram*
   💖 ꒱ Contenido de Instagram.
🍬 *#tts • #tiktoks* + [búsqueda]
   💖 ꒱ Buscar y bajar TikToks.
🍬 *#terabox • #tb* + [enlace]
   💖 ꒱ Descarga de Terabox.
🍬 *#gdrive • #drive* + [enlace]
   💖 ꒱ Archivos de Google Drive.
🍬 *#ttimg • #ttmp3* + <url>
   💖 ꒱ Fotos/audios de TikTok.
🍬 *#gitclone* + <url>
   💖 ꒱ Clona repos de GitHub.
🍬 *#xvideosdl*
   💖 ꒱ Baja videos Xvideos (😳).
🍬 *#xnxxdl*
   💖 ꒱ Baja videos Xnxx (😳).
🍬 *#apk • #modapk*
   💖 ꒱ APKs de Aptoide.
🍬 *#tiktokrandom • #ttrandom*
   💖 ꒱ Un TikTok sorpresa.
🍬 *#npmdl • #npmdownloader*
   💖 ꒱ Paquetes de NPMJs.
🍬 *#animelinks • #animedl*
   💖 ꒱ Links descarga anime.

꒰ づ ꒳ ど ꒱ 🍓 *economia* 🍓 ꒰ つ ꒳ ご ꒱
✨ ¡A juntar ${moneda} y brillar! ✨
⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆
🌸 *#w • #work • #trabajar*
   🎀 ꒱ ¡A chambear por ${moneda}!
🌸 *#slut • #protituirse*
   🎀 ꒱ Gana ${moneda} atrevidamente ;).
🌸 *#cf • #suerte*
   🎀 ꒱ ¿Cara o cruz con ${moneda}?
🌸 *#crime • #crimen*
   🎀 ꒱ Trabajo arriesgado por ${moneda}.
🌸 *#ruleta • #roulette • #rt*
   🎀 ꒱ Apuesta ${moneda} ¡Suerte!
🌸 *#casino • #apostar*
   🎀 ꒱ Prueba suerte con ${moneda}.
🌸 *#slot*
   🎀 ꒱ ¡Gira la ruleta y gana ${moneda}!
🌸 *#cartera • #wallet*
   🎀 ꒱ Tus ${moneda} guardaditas.
🌸 *#banco • #bank*
   🎀 ꒱ Tus ${moneda} en el banco.
🌸 *#deposit • #depositar • #d*
   🎀 ꒱ Guarda ${moneda} en el banco.
🌸 *#with • #retirar • #withdraw*
   🎀 ꒱ Saca ${moneda} del banco.
🌸 *#transfer • #pay*
   🎀 ꒱ Comparte ${moneda}/XP.
🌸 *#miming • #minar • #mine*
   🎀 ꒱ ¡A picar recursos!
🌸 *#buyall • #buy*
   🎀 ꒱ Compra ${moneda} con XP.
🌸 *#daily • #diario*
   🎀 ꒱ Tu recompen-chan diaria.
🌸 *#cofre*
   🎀 ꒱ Cofrecito con sorpresas.
🌸 *#weekly • #semanal*
   🎀 ꒱ Tu regalito semanal.
🌸 *#monthly • #mensual*
   🎀 ꒱ Recompensa del mes.
🌸 *#steal • #robar • #rob*
   🎀 ꒱ Intenta tomar ${moneda} shhh.
🌸 *#robarxp • #robxp*
   🎀 ꒱ ¿Te atreves a robar XP?
🌸 *#eboard • #baltop*
   🎀 ꒱ Ranking de ${moneda}.
🌸 *#aventura • #adventure*
   🎀 ꒱ ¡Aventura épica!
🌸 *#curar • #heal*
   🎀 ꒱ Cúrate para seguir.
🌸 *#cazar • #hunt • #berburu*
   🎀 ꒱ ¡De caza!
🌸 *#inv • #inventario*
   🎀 ꒱ Tu mochila de ítems.
🌸 *#mazmorra • #explorar*
   🎀 ꒱ Explora y gana ${moneda}.
🌸 *#halloween*
   🎀 ꒱ ¡Dulce o truco! (Halloween 🎃).
🌸 *#christmas • #navidad*
   🎀 ꒱ ¡Regalos! (Navidad 🎄).

૮₍ ˃ ⤙ ˂ ₎ა☁️ *gacha* ☁️૮₍ ˃ ⤙ ˂ ₎ა
💖 ¡Colecciona personajitos! 💖
✧･ﾟ:*✧ S 같아요 ✧*:･ﾟ✧
⭐ *#rollwaifu • #rw • #roll*
   💌 ꒱ Waifu/husbando al azar.
⭐ *#claim • #c • #reclamar*
   💌 ꒱ ¡Reclama tu personaje!
⭐ *#harem • #waifus • #claims*
   💌 ꒱ Tu colección especial.
⭐ *#charimage • #waifuimage • #wimage*
   💌 ꒱ Foto random de personaje.
⭐ *#charinfo • #winfo • #waifuinfo*
   💌 ꒱ Info de un personaje.
⭐ *#givechar • #givewaifu • #regalar*
   💌 ꒱ Regala un personaje.
⭐ *#vote • #votar*
   💌 ꒱ Vota por tu personaje.
⭐ *#waifusboard • #waifustop • #topwaifus*
   💌 ꒱ Top personajes queridos.

(づ ᴗ _ᴗ)づ♡ *sticker* ♡⊂(・﹏・⊂)
🎨 ¡Stickers super monos! 🎨
✂️｡･:*:･ﾟ★,｡･:*:･ﾟ☆
🧸 *#sticker • #s*
   🌈 ꒱ Imágenes/videos a stickers.
🧸 *#setmeta*
   🌈 ꒱ Nombre y autor a tu pack.
🧸 *#delmeta*
   🌈 ꒱ Borra tu pack de stickers.
🧸 *#pfp • #getpic*
   🌈 ꒱ Fotito de perfil de alguien.
🧸 *#qc*
   🌈 ꒱ Stickers con texto/usuario.
🧸 *#toimg • #img*
   🌈 ꒱ Stickers a imagen. ¡Magia!
🧸 *#brat • #ttp • #attp*︎
   🌈 ꒱ Stickers con texto cool.
🧸 *#emojimix*
   🌈 ꒱ Mezcla emojis = sticker.
🧸 *#wm*
   🌈 ꒱ Cambia nombre de stickers.

ପ૮{˶• ༝ •˶}ა ♡ *herramientas* ♡ ପ૮{˶• ༝ •˶}ა
🛠️ ¡Herramientas útiles! 🛠️
🔧✨₊˚.༄ --˚₊·➳❥🔧
🔩 *#calcular • #calculadora • #cal*
   🧮 ꒱ Resuelve mates.
🔩 *#tiempo • #clima*
   🧮 ꒱ ¿Qué tal el clima? ☀️☁️
🔩 *#horario*
   🧮 ꒱ Hora en el mundito.
🔩 *#fake • #fakereply*
   🧮 ꒱ Mensajito falso. ¡Jeje!
🔩 *#enhance • #remini • #hd*
   🧮 ꒱ Mejora tus fotitos a HD.
🔩 *#letra*
   🧮 ꒱ Cambia estilo de letras.
🔩 *#read • #readviewonce • #ver*
   🧮 ꒱ Mira imágenes secretas.
🔩 *#whatmusic • #shazam*
   🧮 ꒱ ¿Qué canción es?
🔩 *#spamwa • #spam*
   🧮 ꒱ Spam (¡con cuidado!).
🔩 *#ss • #ssweb*
   🧮 ꒱ Captura de web.
🔩 *#length • #tamaño*
   🧮 ꒱ Cambia tamaño img/vid.
🔩 *#say • #decir* + [texto]
   🧮 ꒱ Repito lo que digas.
🔩 *#todoc • #toducument*
   🧮 ꒱ Crea docs (audio, img, vid).
🔩 *#translate • #traducir • #trad*
   🧮 ꒱ Traduce palabritas.

˚₊‧꒰ა ☆ ໒꒱ *perfil* ꒰ა ☆ ໒꒱‧₊˚
👤 ¡Tu rinconcito personal! 👤
🌷◌₊˚⋆｡˚୨୧⋆｡˚ ⋆🌷
🌸 *#reg • #verificar • #register*
   🎀 ꒱ Regístrate. ¡Bienvenid@!
🌸 *#unreg*
   🎀 ꒱ Borra tu registro. ¡Bye!
🌸 *#profile*
   🎀 ꒱ ¡Muestra tu perfil!
🌸 *#marry* [mención]
   🎀 ꒱ ¡Pide matrimonio! 💍💕
🌸 *#divorce*
   🎀 ꒱ Termina matrimonio virtual.
🌸 *#setgenre • #setgenero*
   🎀 ꒱ Define tu género.
🌸 *#delgenre • #delgenero*
   🎀 ꒱ Quita tu género.
🌸 *#setbirth • #setnacimiento*
   🎀 ꒱ Guarda tu cumple. 🎂
🌸 *#delbirth • #delnacimiento*
   🎀 ꒱ Borra tu cumple.
🌸 *#setdescription • #setdesc*
   🎀 ꒱ Escribe una bio bonita.
🌸 *#deldescription • #deldesc*
   🎀 ꒱ Borra tu bio.
🌸 *#lb • #lboard* + <Página>
   🎀 ꒱ Top XP y nivel. ¡Wow!
🌸 *#level • #lvl* + <@Mención>
   🎀 ꒱ Tu nivel y XP. ¡Sigue!
🌸 *#comprarpremium • #premium*
   🎀 ꒱ Pase VIP sin límites.
🌸 *#confesiones • #confesar*
   🎀 ꒱ ¡Confiesa en secreto! 🤫

૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა 🏡 *grupos* 🏡 ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა
💖 ¡Grupos geniales! 💖
✨ ⋅┄┈┄┈┄┈┄⋅ ✨
👑 *#config • #on*
   🏰 ꒱ Opciones de tu grupito.
👑 *#hidetag*
   🏰 ꒱ Mensaje secreto a todos.
👑 *#gp • #infogrupo*
   🏰 ꒱ Chismecito del grupo.
👑 *#linea • #listonline*
   🏰 ꒱ ¿Quiénes están online?
👑 *#setwelcome*
   🏰 ꒱ Bienvenida adorable.
👑 *#setbye*
   🏰 ꒱ Despedida tierna.
👑 *#link*
   🏰 ꒱ Link mágico del grupo.
👑 *#admins • #admin*
   🏰 ꒱ ¡Llama a los jefes!
👑 *#restablecer • #revoke*
   🏰 ꒱ Nuevo link. ¡Fresco!
👑 *#grupo • #group* [open/abrir]
   🏰 ꒱ ¡Todos hablan! Fiesta.
👑 *#grupo • #group* [close/cerrar]
   🏰 ꒱ Solo admins. ¡Shhh!
👑 *#kick* [número/mención]
   🏰 ꒱ Despide a alguien. ¡Adiós!
👑 *#add • #añadir* [número]
   🏰 ꒱ Invita un nuevo amigui.
👑 *#promote* [mención]
   🏰 ꒱ ¡Hacer admin! Poderes.
👑 *#demote* [mención]
   🏰 ꒱ Quitar admin. Oh no...
👑 *#gpbanner • #groupimg*
   🏰 ꒱ Cambia foto del grupo.
👑 *#gpname • #groupname*
   🏰 ꒱ Nuevo nombre al grupo.
👑 *#gpdesc • #groupdesc*
   🏰 ꒱ Nueva desc al grupo.
👑 *#advertir • #warn*
   🏰 ꒱ Advertencia suave.
👑 *#unwarn • #delwarn*
   🏰 ꒱ ¡Quitar advertencias!
👑 *#advlist • #listadv*
   🏰 ꒱ Lista de portados mal.
👑 *#bot on*
   🏰 ꒱ ¡Despiértame aquí!
👑 *#bot off*
   🏰 ꒱ Déjame dormir aquí.
👑 *#mute* [mención]
   🏰 ꒱ Silencia a alguien.
👑 *#unmute* [mención]
   🏰 ꒱ ¡Que vuelva a hablar!
👑 *#encuesta • #poll*
   🏰 ꒱ Crea encuestas.
👑 *#delete • #del*
   🏰 ꒱ Borra mensajitos.
👑 *#fantasmas*
   🏰 ꒱ ¿Quiénes son inactivos?
👑 *#kickfantasmas*
   🏰 ꒱ ¡Adiós fantasmitas!
👑 *#invocar • #tagall • #todos*
   🏰 ꒱ ¡Llama a la pandilla!
👑 *#setemoji • #setemo*
   🏰 ꒱ Cambia emoji invitación.
👑 *#listnum • #kicknum*
   🏰 ꒱ Elimina por prefijo país.

૮⸝⸝˃ مَا ˂⸝⸝ა 🌸 *anime* 🌸 ૮⸝⸝˃ مَا ˂⸝⸝ა
💌 ¡Reacciones anime! 💌
🎀 ☆ → ༄‧₊˚「 」◞♡°
💖 *#angry • #enojado* + <mención>
   😠 ꒱ ¡Grrr, furi!
💖 *#bite* + <mención>
   🧛 ꒱ ¡Ñam! Te muerdo.
💖 *#bleh* + <mención>
   😛 ꒱ ¡Te saco la lengua!
💖 *#blush* + <mención>
   😊 ꒱ Me sonrojo >///<
💖 *#bored • #aburrido* + <mención>
   😑 ꒱ Aburrido... zzz.
💖 *#cry* + <mención>
   😭 ꒱ ¡Buuuaaa, a llorar!
💖 *#cuddle* + <mención>
   🤗 ꒱ Abrashito apapachable.
💖 *#dance* + <mención>
   💃 ꒱ ¡A mover el esqueleto!
💖 *#drunk* + <mención>
   🥴 ꒱ Ups, tomé de más.
💖 *#eat • #comer* + <mención>
   😋 ꒱ ¡A comer rico!
💖 *#facepalm* + <mención>
   🤦‍♀️ ꒱ ¡Ay, Dios!
💖 *#happy • #feliz* + <mención>
   😄 ꒱ ¡Saltando de alegría!
💖 *#hug* + <mención>
   🫂 ꒱ ¡Abrazo fuerte!
💖 *#impregnate • #preg* + <mención>
   🤰 ꒱ Oh... sorpresa (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)
💖 *#kill* + <mención>
   🔪 ꒱ A mimir... para siempre.
💖 *#kiss • #besar* • #kiss2 + <mención>
   😘 ꒱ ¡Un besito muak!
💖 *#laugh* + <mención>
   😂 ꒱ ¡Jajaja, qué risa!
💖 *#lick* + <mencion>
   👅 ꒱ Un lametoncito.
💖 *#love • #amor* + <mencion>
   😍 ꒱ ¡En las nubes por ti!
💖 *#pat* + <mencion>
   👋😊 ꒱ Palmaditas.
💖 *#poke* + <mencion>
   👉 ꒱ ¡Te pico!
💖 *#pout* + <mencion>
   🥺 ꒱ Haciendo pucheros.
💖 *#punch* + <mencion>
   👊 ꒱ ¡Toma! Un puñetazo.
💖 *#run* + <mencion>
   🏃‍♀️ ꒱ ¡A correr!
💖 *#sad • #triste* + <mencion>
   😢 ꒱ Me siento bajonead@.
💖 *#scared* + <mencion>
   😨 ꒱ ¡Qué miedito!
💖 *#seduce* + <mencion>
   😏 ꒱ ¿Te seduzco?
💖 *#shy • #timido* + <mencion>
   😳 ꒱ Me da penita...
💖 *#slap* + <mencion>
   🖐️💥 ꒱ ¡Cachetada! Zas.
💖 *#dias • #days*
   ☀️ ꒱ ¡Buenos días!
💖 *#noches • #nights*
   🌙 ꒱ ¡Dulces sueños!
💖 *#sleep* + <mencion>
   😴 ꒱ A mimir Zzz...
💖 *#smoke* + <mencion>
   🚬 ꒱ Echando humito.
💖 *#think* + <mencion>
   🤔 ꒱ Hmmm, pensando...

(⁄ ⁄>⁄ ﹃ ⁄<⁄ ⁄) 🔞 *NSFW* 🔞 (⁄ ⁄>⁄ ﹃ ⁄<⁄ ⁄)
🍓 ¡Solo para mayores! 🍓
🌶️~--~🌶️~--~🌶️
💋 *#anal* + <mención>
   🍑 ꒱ Por... atrás.
💋 *#waifu*
   💌 ꒱ Tu waifu ideal.
💋 *#bath* + <mencion>
   🛁 ꒱ Bañito... ¿juntos?
💋 *#blowjob • #mamada • #bj* + <mención>
   👄 ꒱ Un trabajito oral.
💋 *#boobjob* + <mencion>
   🍈🍈 ꒱ Entre las montañas.
💋 *#cum* + <mencion>
   💦 ꒱ Ups... me vine.
💋 *#fap* + <mencion>
   ✊🍆 ꒱ Amor propio.
💋 *#ppcouple • #ppcp*
   🧑‍🤝‍🧑 ꒱ Fotos para parejas/amigis.
💋 *#footjob* + <mencion>
   👣 ꒱ Con los pies.
💋 *#fuck • #coger • #fuck2* + <mención>
   💘 ꒱ ¡Acción intensa!
💋 *#cafe • #coffe*
   ☕ ꒱ Cafecito... ¿y más?
💋 *#violar • #perra* + <mencion>
   😈 ꒱ Modo diabl@.
💋 *#grabboobs* + <mencion>
   🤏🍈 ꒱ Agarrando.
💋 *#grop* + <mencion>
   🖐️😏 ꒱ Manoseo juguetón.
💋 *#lickpussy* + <mencion>
   👅🐱 ꒱ Lamiendo tesorito.
💋 *#rule34 • #r34* + [Tags]
   🎨🔞 ꒱ Arte picante R34.
💋 *#sixnine • #69* + <mencion>
   ♋ ꒱ La posición 69.
💋 *#spank • #nalgada* + <mencion>
   👋🍑 ꒱ Nalgadita traviesa.
💋 *#suckboobs* + <mencion>
   👶🍈 ꒱ Chupando como bebé.
💋 *#undress • #encuerar* + <mencion>
    👚➡️💃 ꒱ ¡Fuera ropa!
💋 *#yuri • #tijeras* + <mencion>
   ✂️♀️♀️ ꒱ Amor entre chicas.

૮ • ﻌ - ა⁩ 🎉 *juegos* 🎉 ૮ • ﻌ - ა⁩
🎲 ¡A divertirse! 🎲
🎮🕹️⋆｡˚☽˚｡⋆.🎮
🎈 *#amistad • #amigorandom*
   🤝 ꒱ ¡Haz un nuevo amigui!
🎈 *#chaqueta • #jalamela*
   😏💦 ꒱ Una manita amiga...
🎈 *#chiste*
   😂 ꒱ Te cuento un chiste.
🎈 *#consejo*
   💡 ꒱ Un consejito sabio.
🎈 *#doxeo • #doxear* + <mención>
   🤫😈 ꒱ Doxeo falso (broma).
🎈 *#facto*
   🧐 ꒱ Te lanzo un facto.
🎈 *#formarpareja*
   💞 ꒱ ¡Creando parejitas!
🎈 *#formarpareja5*
   💍x5 ꒱ ¡5 parejitas!
🎈 *#frase*
   📜 ꒱ Una frase para ti.
🎈 *#huevo* + <mención>
   🥚🤏 ꒱ ¡Agarra ese huevo!
🎈 *#chupalo* + <mencion>
   🍭😏 ꒱ Haz que te lo chupen.
🎈 *#aplauso* + <mencion>
   👏🥳 ꒱ ¡Bravo!
🎈 *#marron* + <mencion>
   🍫😜 ꒱ Broma de color (respeto).
🎈 *#suicidar*
   😵 ꒱ Simula... adiós.
🎈 *#iq • #iqtest* + <mención>
   🧠✨ ꒱ ¿Qué tan list@?
🎈 *#meme*
   😹 ꒱ Un meme para ti.
🎈 *#morse*
   -... .- -.- .- ꒱ Texto a morse.
🎈 *#nombreninja*
   🥷✨ ꒱ Tu nombre ninja.
🎈 *#paja • #pajeame*
   😩💦 ꒱ Paja virtual.
🎈 *#personalidad* + <mencion>
   💖🌟 ꒱ Tu personalidad.
🎈 *#piropo*
   😘💬 ꒱ Un piropo.
🎈 *#pregunta*
   ❓🤖 ꒱ Pregúntame.
🎈 *#ship • #pareja*
   💘📈 ꒱ ¿Hay amor?
🎈 *#sorteo*
   🎟️🎁 ꒱ ¡Sorteo!
🎈 *#top*
   🏆🥇 ꒱ Crea un top.
🎈 *#formartrio* + <mencion>
   👨‍👩‍👧‍👦➡️👩‍👩‍👦 ꒱ ¡Un trío!
🎈 *#ahorcado*
   💀🪢 ꒱ Juega ahorcado.
🎈 *#genio*
   🧞‍♂️💡 ꒱ Pide al genio.
🎈 *#mates • #matematicas*
   ➕➖✖️➗ ꒱ Resuelve y gana.
🎈 *#ppt*
   ✂️📄🪨 ꒱ Piedra, papel, tijeras.
🎈 *#sopa • #buscarpalabra*
   🍲🔍 ꒱ Sopa de letras.
🎈 *#pvp • #suit* + <mención>
   ⚔️🤺 ꒱ ¡Duelo épico!
🎈 *#ttt*
    XOX ꒱ Tres en raya.

  `.trim()

  await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: global.channelRD?.id || '120363274024192200@newsletter', // Fallback
              newsletterName: global.channelRD?.name || '🎀 ᴄᴜᴛᴇ ɴᴇᴡs 🎀', // Fallback
              serverMessageId: -1,
          },
          forwardingScore: 999, 
          externalAdReply: {
              title: `🌸 ${botname} 🌸`,
              body: `🎀 ${global.textbot || 'Tu Asistente Kawaii'} 🎀`, // Fallback
              thumbnailUrl: global.banner || 'https://example.com/default_banner.jpg', // Fallback
              sourceUrl: global.redes || 'https://example.com', // Fallback
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `💖 ${hours}h ${minutes}m ${seconds}s 💖`
}
