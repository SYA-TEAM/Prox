import yts from "yt-search";
import { ytv, yta } from "./_ytdl.js";

const limit = 100; // MB límite para enviar video como documento

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");

    await m.react("🕐"); // reacción de espera rápida

    const res = await yts(text);
    if (!res || !res.all || res.all.length === 0)
      return m.reply("No se encontraron resultados para tu búsqueda.");

    const video = res.all[0];

    // Caption con info del video (puedes cambiar estilo)
    const cap = `> *❀ ${video.title}*\n
> ➮ Autor: *${video.author.name}*
> ➮ Duración: *${video.duration.timestamp}*
> ➮ Vistas: *${video.views}*
> ➮ URL: *${video.url}*`;

    // Enviar miniatura directo por URL (sin descargar buffer)
    await conn.sendFile(m.chat, video.thumbnail, "thumbnail.jpg", cap, m);

    if (command === "play") {
      // AUDIO: enviar URL directo sin descarga previa
      try {
        const api = await yta(video.url);
        await conn.sendFile(
          m.chat,
          api.result.download, // URL directa mp3
          api.result.title + ".mp3",
          "", // sin caption extra
          m,
          null,
          { mimetype: "audio/mpeg", ptt: false }
        );
        await m.react("✅");
      } catch (error) {
        return m.reply("❌ Error al descargar el audio: " + error.message);
      }
    } else if (command === "play2" || command === "playvid") {
      // VIDEO: enviar URL directo sin descargar
      try {
        const api = await ytv(video.url);
        const resVideo = await fetch(api.url);
        const contLength = resVideo.headers.get("content-length");
        const bytes = contLength ? parseInt(contLength, 10) : 0;
        const sizeMB = bytes / (1024 * 1024);
        const asDocument = sizeMB >= limit;

        await conn.sendFile(
          m.chat,
          api.url, // URL directo mp4
          api.title + ".mp4",
          "", // sin caption extra
          m,
          null,
          { asDocument, mimetype: "video/mp4" }
        );
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
handler.command = ["play", "play2", "playvid"];

export default handler;
