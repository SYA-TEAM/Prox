import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, '*❌ Ingresa un término para buscar.*', m);

    await m.react('🔍');
    try {
        const searchResults = await searchVideos(args.join(" "));

        if (!searchResults.length) throw 'No se encontraron resultados.';

        const video = searchResults[0];
        const thumbnail = await (await fetch(video.miniatura)).buffer();

        const texto = [
            `✨ *${video.titulo}*`,
            ``,
            `📌 *Duración:* ${video.duracion}`,
            `🎙️ *Autor:* ${video.canal}`,
            `📆 *Publicado:* ${convertTimeToSpanish(video.publicado)}`,
            `🌐 *Enlace:* ${video.url}`,
            ``,
            `⚔️ Elige una opción para descargar:`
        ].join('\n');

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: texto,
            footer: '${wm}',
            mentions: [m.sender],
            buttons: [
                { buttonId: `${usedPrefix}playaudio ${video.url}`, buttonText: { displayText: '🎧 Audio' }, type: 1 },
                { buttonId: `${usedPrefix}ytmp4 ${video.url}`, buttonText: { displayText: '🎞️ Video' }, type: 1 },
            ],
            headerType: 4
        }, { quoted: m });

        await m.react('✅');
    } catch (err) {
        console.error(err);
        await m.react('❌');
        conn.reply(m.chat, '*⚠️ Error al buscar el video.*', m);
    }
};

handler.help = ['play *<texto>*'];
handler.tags = ['dl'];
handler.command = ['play'];

export default handler;

async function searchVideos(query) {
    try {
        const res = await yts(query);
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }));
    } catch (e) {
        console.error('Error en yt-search:', e.message);
        return [];
    }
}

function convertTimeToSpanish(t) {
    return t
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}