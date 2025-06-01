let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌐 Ingresa un texto o link para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Felicidad Shakira`);

  try {
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

    // Esperar respuesta del usuario con un número (1, 2 o 3)
    const collect = (msg) => {
      const from = msg.key.remoteJid;
      const msgText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const isReplyToPrompt = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption === mensaje.trim();

      if (from === m.chat && isReplyToPrompt) {
        let tipo = parseInt(msgText);
        if (![1, 2, 3].includes(tipo)) return;

        conn.ev.off('messages.upsert', listener); // Detener escucha después de la respuesta

        // Reacciones y descarga
        conn.sendMessage(from, { react: { text: '⏬', key: msg.key } });

        fetch(`https://lakiya-api-site.vercel.app/download/ytmp3new?url=${video.url}&type=mp3`)
          .then(res => res.json())
          .then(async dl => {
            const audioUrl = dl.result?.downloadUrl;
            if (!audioUrl) return conn.sendMessage(from, { text: '❌ No se pudo descargar el audio.', quoted: msg });

            conn.sendMessage(from, { react: { text: '📤', key: msg.key } });

            if (tipo === 1) {
              return conn.sendMessage(from, {
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
            }

            if (tipo === 2) {
              return conn.sendMessage(from, {
                document: { url: audioUrl },
                fileName: `${video.title}.mp3`,
                mimetype: 'audio/mp3',
                caption: `🎵 ${video.title}`
              }, { quoted: msg });
            }

            if (tipo === 3) {
              return conn.sendMessage(from, {
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
          })
          .catch(err => {
            console.error(err);
            conn.sendMessage(from, { text: '❌ Error al descargar.', quoted: msg });
          });
      }
    };

    const listener = ({ messages }) => {
      if (!messages || !messages[0]) return;
      const msg = messages[0];
      if (!msg.message || msg.key.fromMe) return;
      collect(msg);
    };

    conn.ev.on('messages.upsert', listener);

  } catch (e) {
    console.error(e);
    m.reply(`❌ Error:\n${e.message}`);
  }
};

handler.command = ["song", "play1"];
handler.help = ["song <nombre o link>"];
handler.tags = ["downloader"];

export default handler;
