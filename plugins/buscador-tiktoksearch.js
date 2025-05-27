import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent,
} = (await import('@whiskeysockets/baileys')).default;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(message.chat, "🌸 ⍴᥆r 𝖿ᥲ᥎᥆r, іᥒgrᥱsᥱ ᥙᥒ 𝗍ᥱ᥊𝗍᥆ ⍴ᥲrᥲ rᥱᥲᥣіzᥲr ᥙᥒᑲᥙ́s𝗊ᥙᥱძᥲ ᥱᥒ 𝗍іk𝗍᥆k.", message);
  }

  async function createVideoMessage(url) {
    const content = await generateWAMessageContent({
      video: { url },
      mimetype: 'video/mp4'
    }, { upload: conn.waUploadToServer });
    return content.videoMessage;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  try {
    await conn.reply(message.chat, '✧ *𝖤ᥒ᥎іᥲᥒძ᥆ sᥙs rᥱsᥙᥣ𝗍ᥲძ᥆s..*', message, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          showAdAttribution: true,
          title: '♡  ͜ ۬︵࣪᷼⏜݊᷼𝗧𝗶𝗸𝗧𝗼𝗸 𝗦𝗲𝗮𝗿𝗰𝗵⏜࣪᷼︵۬ ͜ ',
          body: global.dev,
          previewType: 0,
          thumbnail: global.avatar,
          sourceUrl: global.redes
        }
      }
    });

    const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(text)}`);
    let searchResults = data.data;
    if (!Array.isArray(searchResults) || searchResults.length === 0) throw new Error("No se encontraron resultados.");

    shuffleArray(searchResults);
    const topResults = searchResults.slice(0, 7);

    const cards = [];
    for (let result of topResults) {
      const videoMsg = await createVideoMessage(result.nowm);
      cards.push(
        proto.Message.InteractiveMessage.Card.fromObject({
          header: {
            hasMediaAttachment: true,
            videoMessage: videoMsg,
            title: result.title
          },
          body: { text: '' },
          footer: { text: global.dev },
          nativeFlowMessage: { buttons: [] }
        })
      );
    }

    const carousel = proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards });

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: { text: "➤ 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎 𝘿𝙀: " + text },
            footer: { text: global.dev },
            header: { hasMediaAttachment: false },
            carouselMessage: carousel
          })
        }
      }
    }, { quoted: message });

    await conn.relayMessage(message.chat, messageContent.message, { messageId: messageContent.key.id });

  } catch (error) {
    conn.reply(message.chat, `⚠︎ *᥆ᥴᥙrrі᥆ ᥙᥒ ᥱrr᥆r:* ${error.message}`, message);
  }
};

handler.help = ["tiktoksearch <txt>"];
handler.tags = ["buscador"];
handler.command = ["tiktoksearch", "ttss", "tiktoks"];
handler.register = true;
handler.group = true;

export default handler;