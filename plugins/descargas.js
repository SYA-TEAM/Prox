import yts from "yt-search";
import { ytv, yta } from "./_ytdl.js";

const limit = 100; // límite en MB para enviar video como archivo o documento

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
    
    await m.react("🕐"); // reacción de espera

    const res = await yts(text);
    if (!res || !res.all || res.all.length === 0) {
      return m.reply("No se encontraron resultados para tu búsqueda.");
    }

    const video = res.all[0];
    const total = Number(video.duration.seconds) || 0;

    const cap = `> *❀ ${video.title}*
    
> ➮ 𝖠𝗎𝗍𝗈𝗋 = *${video.author.name}*
> ➮ 𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇 = *${video.duration.timestamp}*
> ➮ 𝖵𝗂𝗌𝗍𝖺𝗌 = *${video.views}*
> ➮ 𝖤𝗇𝗅𝖺𝖼𝖾 = *${video.url}*`;

    // Obtener imagen como buffer
    const resThumb = await fetch(video.thumbnail);
    const buffer = await resThumb.arrayBuffer ? Buffer.from(await resThumb.arrayBuffer()) : null;
    if (!buffer) return m.reply("No se pudo obtener la miniatura del video.");

    // Enviar imagen con caption
    await conn.sendFile(m.chat, buffer, "thumbnail.jpg", cap, m);

    if (command === "play") {
      try {
        const api = await yta(video.url);
        await conn.sendFile(m.chat, api.result.download, api.result.title, "", m);
        await m.react("✅");
      } catch (error) {
        return m.reply("❌ Error al descargar el audio: " + error.message);
      }
    } else if (command === "play2" || command === "playvid") {
      try {
        const api = await ytv(video.url);
        const resVideo = await fetch(api.url);
        const contLength = resVideo.headers.get("content-length");
        const bytes = contLength ? parseInt(contLength, 10) : 0;
        const sizeMB = bytes / (1024 * 1024);
        const asDocument = sizeMB >= limit;

        await conn.sendFile(m.chat, api.url, api.title, "", m, null, {
          asDocument,
          mimetype: "video/mp4",
        });
        await m.react("✔️");
      } catch (error) {
        return m.reply("❌ Error al descargar el video: " + error.message);
      }
    }
  } catch (error) {
    return m.reply("❌ Ocurrió un error: " + error.message);
  }
};

handler.help = ["play", "play2"];
handler.tags = ["download"];
handler.command = ["play"];

export default handler;
