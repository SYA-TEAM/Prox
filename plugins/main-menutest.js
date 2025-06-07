import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, args }) => {
    // Función para obtener el emoji de la bandera a partir del código del país
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    function banderaEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🌐';
        const codePoints = [...countryCode.toUpperCase()].map(char => 0x1F1E6 + char.charCodeAt(0) - 65);
        return String.fromCodePoint(...codePoints);
    }

    // Obtener información del usuario
    const number = m.sender.replace('@s.whatsapp.net', '');
    const phoneInfo = PhoneNumber('+' + number);
    const countryCode = phoneInfo.getRegionCode('international');
    const bandera = banderaEmoji(countryCode);
    const pais = regionNames.of(countryCode) || 'Desconocido';
    const mundo = `${bandera} ${pais}`;

    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[userId];
    let name = conn.getName(userId);
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;

    // Diseño del menú
    let txt = `
> Hola, @${userId.split('@')[0]} ❀
> Soy *${botname}* ⊹˚୨ •(=^●ω●^=)•

╭─「 ✦ *INFO DE LA BOT* ✦ 」
│✿ *Modo =* Público
│✿ *Bot =* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Sub-Bot 🅑')}
│✿ *Activada =* ${uptime}
│✿ *Usuarios =* ${totalreg}
│✿ *Comandos =* ${totalCommands}
│✿ *País =* ${mundo}
│✿ *Baileys =* Multi Device
╰───────────────

*✧ Usa #qr o #code para ser Sub-Bot*

╭─「 ❀ INFO-BOT ❀ 」
│ ᥫ᭡ Comandos sobre el estado e info de la Bot.
└───────────────
➭ *#help • #menu*
✧ Ver la lista de comandos.
➭ *#uptime • #runtime*
✧ Ver el tiempo de actividad.
➭ *#serbot • #serbot code*
✧ Crea una sesión de Sub-Bot.
➭ *#bots • #sockets*
✧ Ver la lista de Sub-Bots.
➭ *#creador*
✧ Contacto del creador.
➭ *#status • #estado*
✧ Ver el estado actual.
➭ *#links • #grupos*
✧ Ver los enlaces oficiales.
➭ *#infobot*
✧ Ver la información completa.
➭ *#sug • #newcommand*
✧ Sugiere un nuevo comando.
➭ *#ping • #p*
✧ Ver la velocidad de respuesta.
➭ *#reporte • #reportar*
✧ Reporta fallas o problemas.
➭ *#sistema • #system*
✧ Ver estado del alojamiento.
➭ *#speed • #speedtest*
✧ Ver estadísticas de velocidad.
➭ *#views • #usuarios*
✧ Ver usuarios registrados.
➭ *#funciones*
✧ Ver todas las funciones.
➭ *#ds • #fixmsgespera*
✧ Limpiar archivos de sesión.
➭ *#editautoresponder*
✧ Configurar un Prompt personalizado.

╭─「 ❀ BUSCADORES ❀ 」
│ ᥫ᭡ Busca en distintas plataformas.
└───────────────
➭ *#wallpapersearch*
✧ Buscador de wallpapers.
➭ *#tiktoksearch • #tiktoks*
✧ Buscador de videos de TikTok.
➭ *#tweetposts*
✧ Buscador de posts de Twitter/X.
➭ *#ytsearch • #yts*
✧ Realiza búsquedas de YouTube.
➭ *#githubsearch*
✧ Buscador de usuarios de GitHub.
➭ *#cuevana • #cuevanasearch*
✧ Buscador de películas y series.
➭ *#google*
✧ Realiza búsquedas por Google.
➭ *#pin • #pinterest*
✧ Buscador de imágenes de Pinterest.
➭ *#imagen • #image*
✧ Buscador de imágenes de Google.
➭ *#animesearch • #animess*
✧ Buscador de animes.
➭ *#animei • #animeinfo*
✧ Buscador de capítulos.
➭ *#infoanime*
✧ Buscador de info de anime/manga.
➭ *#hentaisearch • #searchhentai*
✧ Buscador de capítulos hentai.
➭ *#xnxxsearch • #xnxxs*
✧ Buscador de vídeos de XNXX.
➭ *#xvsearch • #xvideossearch*
✧ Buscador de vídeos de XVideos.
➭ *#pornhubsearch • #phsearch*
✧ Buscador de videos de PornHub.
➭ *#npmjs*
✧ Buscador de paquetes de NPM.

╭─「 ❀ DESCARGAS ❀ 」
│ ᥫ᭡ Comandos de descarga de archivos.
└───────────────
➭ *#tiktok • #tt*
✧ Descarga videos de TikTok.
➭ *#mediafire • #mf*
✧ Descarga archivos de MediaFire.
➭ *#pinvid • #pinvideo*
✧ Descarga videos de Pinterest.
➭ *#mega • #mg*
✧ Descarga archivos de MEGA.
➭ *#play • #play2*
✧ Descarga música/video de YouTube.
➭ *#ytmp3 • #ytmp4*
✧ Descarga por URL de YouTube.
➭ *#fb • #facebook*
✧ Descarga videos de Facebook.
➭ *#twitter • #x*
✧ Descarga videos de Twitter/X.
➭ *#ig • #instagram*
✧ Descarga contenido de Instagram.
➭ *#terabox • #tb*
✧ Descarga archivos de Terabox.
➭ *#gdrive • #drive*
✧ Descarga archivos de Google Drive.
➭ *#ttimg • #ttmp3*
✧ Descarga fotos/audios de TikTok.
➭ *#gitclone*
✧ Descarga repositorios de GitHub.
➭ *#xvideosdl*
✧ Descarga videos de XVideos.
➭ *#xnxxdl*
✧ Descarga videos de XNXX.
➭ *#apk • #modapk*
✧ Descarga APKs desde Aptoide.
➭ *#tiktokrandom • #ttrandom*
✧ Descarga un video aleatorio de TikTok.
➭ *#npmdl • #npmdownloader*
✧ Descarga paquetes de NPM.
➭ *#animelinks • #animedl*
✧ Descarga desde links disponibles.

╭─「 ❀ ECONOMIA ❀ 」
│ ᥫ᭡ Comandos de economía y RPG.
└───────────────
➭ *#work • #trabajar*
✧ Gana ${moneda} trabajando.
➭ *#slut • #prostituirse*
✧ Gana ${moneda} como... bueno ya sabes.
➭ *#crime • #crimen*
✧ Gana ${moneda} como ladrón.
➭ *#casino • #apostar*
✧ Apuesta tus ${moneda} en el casino.
➭ *#cartera • #wallet*
✧ Revisa tu cartera.
➭ *#banco • #bank*
✧ Revisa tu banco.
➭ *#deposit • #depositar*
✧ Deposita ${moneda} al banco.
➭ *#withdraw • #retirar*
✧ Retira ${moneda} del banco.
➭ *#transfer • #pay*
✧ Transfiere ${moneda} o XP.
➭ *#mining • #minar*
✧ Minar para obtener recursos.
➭ *#buyall • #buy*
✧ Compra ${moneda} con tu XP.
➭ *#daily • #diario*
✧ Reclama tu recompensa diaria.
➭ *#cofre*
✧ Reclama un cofre diario.
➭ *#weekly • #semanal*
✧ Reclama tu regalo semanal.
➭ *#monthly • #mensual*
✧ Reclama tu recompensa mensual.
➭ *#steal • #robar*
✧ Intenta robar ${moneda}.
➭ *#baltop • #eboard*
✧ Ver el ranking de economía.
➭ *#adventure • #aventura*
✧ Ve a una aventura y gana premios.
➭ *#heal • #curar*
✧ Cura tu salud.
➭ *#hunt • #cazar*
✧ Caza animales para ganar premios.
➭ *#inventory • #inv*
✧ Revisa tu inventario.

╭─「 ❀ STICKERS ❀ 」
│ ᥫ᭡ Comandos para crear stickers.
└───────────────
➭ *#sticker • #s*
✧ Crea stickers de imagen/video.
➭ *#qc*
✧ Crea stickers con texto.
➭ *#ttp • #attp*
✧ Crea stickers con texto (avanzado).
➭ *#emojimix*
✧ Fusiona 2 emojis en un sticker.
➭ *#toimg • #img*
✧ Convierte stickers a imagen.
➭ *#getpic • #pfp*
✧ Obtén la foto de perfil.
➭ *#wm*
✧ Cambia el autor de un sticker.
➭ *#setmeta*
✧ Define el pack y autor por defecto.
➭ *#delmeta*
✧ Elimina tu pack por defecto.

╭─「 ❀ HERRAMIENTAS ❀ 」
│ ᥫ᭡ Comandos con útiles funciones.
└───────────────
➭ *#enhance • #hd • #remini*
✧ Mejora la calidad de una imagen.
➭ *#read • #ver*
✧ Revela imágenes de vista única.
➭ *#whatmusic • #shazam*
✧ Identifica una canción.
➭ *#translate • #trad*
✧ Traduce texto a otros idiomas.
➭ *#tiempo • #clima*
✧ Consulta el clima actual.
➭ *#say • #decir*
✧ Haz que la Bot repita un mensaje.
➭ *#ss • #ssweb*
✧ Toma captura de una página web.
➭ *#calcular • #cal*
✧ Resuelve ecuaciones matemáticas.
➭ *#letra*
✧ Cambia la fuente de un texto.

╭─「 ❀ GRUPOS ❀ 」
│ ᥫ᭡ Comandos para administrar grupos.
└───────────────
➭ *#add • #agregar*
✧ Añade un usuario al grupo.
➭ *#kick • #echar*
✧ Elimina un usuario del grupo.
➭ *#promote • #daradmin*
✧ Da admin a un usuario.
➭ *#demote • #quitaradmin*
✧ Quita admin a un usuario.
➭ *#link*
✧ Muestra el enlace del grupo.
➭ *#revoke • #restablecer*
✧ Restablece el enlace del grupo.
➭ *#group • #grupo*
✧ Abre o cierra el grupo.
➭ *#admins • #staff*
✧ Menciona a todos los admins.
➭ *#hidetag*
✧ Mensaje oculto para todos.
➭ *#invocar • #tagall*
✧ Menciona a todos los miembros.
➭ *#infogrupo • #gp*
✧ Muestra la info del grupo.
➭ *#warn • #advertir*
✧ Advierte a un usuario.
➭ *#unwarn • #delwarn*
✧ Quita una advertencia.
➭ *#listadv • #advlist*
✧ Lista de advertidos.
➭ *#fantasmas*
✧ Muestra los miembros inactivos.
➭ *#kickfantasmas*
✧ Elimina a los inactivos.
➭ *#delete • #del*
✧ Elimina un mensaje del bot.
➭ *#setwelcome*
✧ Mensaje de bienvenida.
➭ *#setbye*
✧ Mensaje de despedida.

╭─「 ❀ JUEGOS ❀ 」
│ ᥫ᭡ Diviértete con estos juegos.
└───────────────
➭ *#ppt*
✧ Piedra, Papel o Tijera.
➭ *#tictactoe • #ttt*
✧ Juego del Gato (3 en raya).
➭ *#mates • #matematicas*
✧ Resuelve problemas matemáticos.
➭ *#pregunta*
✧ Hazle una pregunta a la Bot.
➭ *#meme*
✧ Recibe un meme aleatorio.
➭ *#piropo*
✧ Recibe un piropo.
➭ *#frase*
✧ Recibe una frase inspiradora.
➭ *#chiste*
✧ La Bot te cuenta un chiste.
➭ *#doxear*
✧ Simula un doxeo (broma).
➭ *#pareja • #ship*
✧ Calcula la probabilidad de amor.
➭ *#formarpareja*
✧ Forma una pareja aleatoria.
➭ *#iqtest • #iq*
✧ Mide el IQ de alguien.

╭─「 ❀ NSFW (+18) ❀ 」
│ ᥫ᭡ Comandos para adultos.
└───────────────
➭ *#nsfw*
✧ Activa o desactiva estos comandos.
➭ *#rule34 • #r34*
✧ Busca imágenes en Rule34.
➭ *#pornhubsearch*
✧ Busca videos en PornHub.
➭ *#xnxxsearch*
✧ Busca videos en XNXX.
➭ *#pack*
✧ Imágenes de chicas.
➭ *#pack2*
✧ Imágenes de chicos.
➭ *#pack3*
✧ Imágenes de furros.
➭ *#waifu*
✧ Imagen de una waifu.
➭ *#yuri*
✧ Imágenes yuri.
➭ *#yaoi*
✧ Imágenes yaoi.
`.trim();

    await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402846939411@newsletter', // Reemplaza con tu ID de canal si lo tienes
                newsletterName: '✧・ﾟ: 𝑺𝒀𝑨 𝑻𝑬𝑨𝑴 :・ﾟ✧', // Reemplaza con el nombre de tu canal
                serverMessageId: -1,
            },
            forwardingScore: 99999,
            externalAdReply: {
                title: wm,
                body: "👤 Menú Principal 🍫", // Puedes cambiar este texto
                thumbnailUrl: banner, // URL de una imagen para la miniatura
                sourceUrl: 'https://github.com/RDT-BOT/R-D-T-Bot', // URL de tu repositorio o página
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

// Función para formatear el tiempo
function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
