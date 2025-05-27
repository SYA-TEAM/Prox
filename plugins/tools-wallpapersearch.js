const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys")).default;
import axios from 'axios';

let handler = async (message, { conn, text }) => {
    if (!text) {
        return conn.reply(message.chat, `*⍴᥆r 𝖿ᥲ᥎᥆r, іᥒgrᥱsᥲ ᥣ᥆ 𝗊ᥙᥱ ძᥱsᥱᥲs ᑲᥙsᥴᥲr ..*`, message);
    }

    await message.react('⏱️');
    conn.reply(message.chat, `*✆ 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘯𝘥𝘰 𝘦 𝘦𝘯𝘷𝘪𝘢𝘯𝘥𝘰 𝘪𝘮𝘢́𝘨𝘦𝘯𝘦𝘴.*`, message);

    const apiUrl = `https://delirius-apiofc.vercel.app/search/wallpapers?q=${encodeURIComponent(text)}`;

    try {
        const response = await axios.get(apiUrl);
        const images = response.data.data.map(item => item.image);

        let cards = [];

        for (const [index, item] of response.data.data.entries()) {
            if (index >= 5) break;

            const imageUrl = item.image;
            const buttonUrl = item.thumbnail?.startsWith('http') ? item.thumbnail : imageUrl;

            cards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `Imagen ${index + 1}: ${item.title}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: '✦ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴡɪʀᴋ ❆'
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: item.title,
                    hasMediaAttachment: true,
                    imageMessage: await createImageMessage(imageUrl, conn)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "➮ Ver Más ★",
                            url: buttonUrl
                        })
                    }]
                })
            });
        }

        const carouselMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `✎ ʀ𝖾𝗌𝗎𝗅𝗍𝖺𝖽𝗈𝗌 ძ𝖾 : ${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: '𝗚𝗮𝗹𝗲𝗿𝗶́𝗮 𝗱𝗲 𝗶𝗺𝗮𝗴𝗲𝗻𝗲𝘀 𝗔𝗻𝘆𝗮 𝗙𝗼𝗿𝗴𝗲𝗿',
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: cards
                        })
                    })
                }
            }
        }, { quoted: message });

        await conn.relayMessage(message.chat, carouselMessage.message, { messageId: carouselMessage.key.id });

    } catch (error) {
        console.error(error);
        conn.reply(message.chat, `⚠️ Error al buscar imágenes.`, message);
    }
};

async function createImageMessage(imageUrl, conn) {
    const { imageMessage } = await generateWAMessageContent({
        image: { url: imageUrl }
    }, { upload: conn.waUploadToServer });

    return imageMessage;
}

handler.tags = ['wallpapersearch'];
handler.help = ['wallpapersearch *<palabra clave>*'];
handler.command = ['wallpapersearch'];
handler.register = true;

export default handler;