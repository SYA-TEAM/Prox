import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';
import yts from 'yt-search';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix: prefijo }) => {
    const device = await getDevice(m.key.id);

    if (!text) return conn.reply(m.chat, '⚠️ 𝙄𝙉𝙂𝙍𝙀𝙎𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙇𝘼 𝙈Ú𝙎𝙄𝘾𝘼 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝙀𝙎 𝘽𝙐𝙎𝘾𝘼𝙍 ⚠️', m);

    const results = await yts.search({ query: text, pages: 1 });
    const videos = results.videos.slice(0, 10);
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    if (device !== 'desktop' && device !== 'web') {
        const messa = await prepareWAMessageMedia({ image: { url: randomVideo.thumbnail } }, { upload: conn.waUploadToServer });
        
        const interactiveMessage = {
            body: {
                text: `*『 YOUTUBE － SEARCH 』*\n\n` +
                      `「✦」𝗧𝗶𝘁𝘂𝗹𝗼 = ${randomVideo.title}\n` +
                      `「✦」𝗗𝘂𝗿𝗮𝗰𝗶𝗼𝗻 = ${randomVideo.duration.timestamp}\n` +
                      `「✦」𝗖𝗮𝗻𝗮𝗹 = ${randomVideo.author.name || 'Desconocido'}\n` +
                      `「✦」𝗣𝘂𝗯𝗹𝗶𝗰𝗮𝗱𝗼 = ${randomVideo.ago}\n` +
                      `「✦」𝗘𝗻𝗹𝗮𝗰𝗲 = ${randomVideo.url}`
            },
            footer: { text: `${global.dev || '✿ ᴀɴʏᴀ ✿'}`.trim() },
            header: {
                title: ``,
                hasMediaAttachment: true,
                imageMessage: messa.imageMessage,
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: '✦ 𝖮𝗉𝖼𝗂𝗈𝗇𝖾𝗌 ✦',
                            sections: videos.map((video) => ({
                                title: video.title,
                                rows: [
                                    { header: video.title, title: video.author.name, description: 'Descargar MP3 (Audio)', id: `${prefijo}ytmp3 ${video.url}` },
                                    { header: video.title, title: video.author.name, description: 'Descargar MP4 (Video)', id: `${prefijo}ytmp4 ${video.url}` }
                                ]
                            }))
                        })
                    }
                ],
                messageParamsJson: ''
            }
        };

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: { interactiveMessage }
            }
        }, { userJid: conn.user.jid, quoted: null });

        conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } else {
        const idioma = global.db.data.users[m.sender]?.language || 'es';
        const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`));
        const traductor = _translate.plugins.buscador_yts;
        const teks = results.videos.map((v) => `
「✦」*Título* = ${v.title}
「✦」*Enlace* = ${v.url}
「✦」*Duración* = ${v.timestamp}
「✦」*Publicado* = ${v.ago}
「✦」*Vistas* = ${v.views}`).join('\n\n───────────────\n\n');

        conn.sendFile(m.chat, results.videos[0].thumbnail, 'thumb.jpg', teks.trim(), m);
    }
};

handler.help = ['yts *<texto>*'];
handler.tags = ['dl'];
handler.command = ['yts', 'ytsearch'];
handler.register = true;

export default handler;
