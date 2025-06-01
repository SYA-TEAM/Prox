let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌐 Ingresa un texto o link para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Felicidad Shakira`);

  try {
    // Buscar video
    const yts = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`)).json();
    if (!yts?.data?.length) return m.reply("❌ No se encontraron resultados.");
    const video = yts.data[0];

    const mensaje = `
「🐉 *HASHI SONG DL* 🐉」

┏━❮ *SON INFO* ❯━
┃🎧 *Título:* ${video.title}
┃🕒 *Duración:* ${video.duration}
┃👀 *Vistas:* ${video.views}
┃📅 *Publicado:* ${video.published}
┗━━━━━━━━━━━━━━𖣔𖣔

╭━━〔🔢 *RESPONDE UN NÚMERO* 〕━━⊷
┃1️⃣ Descargar Audio 🎧
┃2️⃣ Descargar Documento 📁
┃3️⃣ Descargar Nota de Voz 🎤
╰──────────────⊷
`;

    const sent = await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: mensaje,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: `☛ Duración: ${video.duration} | Canal: ${video.author.name}`,
          thumbnailUrl: video.image,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    const idMensaje = sent.key.id;

    conn.ev.on('messages.upsert', async (msgUp) => {
      const msg = msgUp.messages[0];
      if (!msg.message || msg.key.fromMe) return;
      const msgText = msg.message.conversation || msg.message.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      const isReply = msg.message?.extendedTextMessage?.contextInfo?.stanzaId === idMensaje;

      if (from === m.chat && isReply) {
        let tipo = parseInt(msgText);
        if (![1, 2, 3].includes(tipo)) return;

        await conn.sendMessage(from, { react: { text: '⏬', key: msg.key } });

        const dl = await (await fetch(`https://lakiya-api-site.vercel.app/download/ytmp3new?url=${video.url}&type=mp3`)).json();
        const audioUrl = dl.result?.downloadUrl;
        if (!audioUrl) return m.reply("❌ No se pudo descargar el audio.");

        await conn.sendMessage(from, { react: { text: '📤', key: msg.key } });

        if (tipo === 1) {
          await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            contextInfo: {
              externalAdReply: {
                title: video.title,
                body: video.author.name,
                sourceUrl: video.url,
                mediaType: 1,
                thumbnailUrl: video.image,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: msg });
        } else if (tipo === 2) {
          await conn.sendMessage(from, {
            document: { url: audioUrl },
            fileName: `${video.title}.mp3`,
            mimetype: 'audio/mp3',
            caption: `🎵 ${video.title}`
          }, { quoted: msg });
        } else if (tipo === 3) {
          await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true,
            contextInfo: {
              externalAdReply: {
                title: video.title,
                body: video.author.name,
                sourceUrl: video.url,
                mediaType: 1,
                thumbnailUrl: video.image,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: msg });
        }

        conn.ev.off('messages.upsert', this);
      }
    });

  } catch (e) {
    console.error(e);
    m.reply(`❌ Error:\n${e.message}`);
  }
};

handler.command = ["song", "play1"];
handler.help = ["song <nombre o link>"];
handler.tags = ["downloader"];

export default handler;
