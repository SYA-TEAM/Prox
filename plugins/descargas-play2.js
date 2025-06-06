import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatosAudio = ["mp3"];
const formatosVideo = ["360"];

const ddownr = {
  download: async (url, format) => {
    if (!formatosAudio.includes(format) && !formatosVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado.");
    }

    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

    try {
      const res = await axios.get(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });
      if (!res.data?.success) throw new Error("⛔ No se pudo obtener detalles del video.");
      const { id, title, info } = res.data;
      const downloadUrl = await ddownr.cekProgress(id);
      return { title, image: info.image, downloadUrl };
    } catch (e) {
      throw new Error("🛑 Error al procesar descarga: " + e.message);
    }
  },

  cekProgress: async (id) => {
    const url = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    while (true) {
      try {
        const res = await axios.get(url, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (res.data?.success && res.data.progress === 1000) {
          return res.data.download_url;
        }
        await new Promise(r => setTimeout(r, 1000)); // más rápido
      } catch (e) {
        throw new Error("⚠ Error en progreso: " + e.message);
      }
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  await m.react("⏳");

  if (!text) return m.reply("🎧 Escribe el nombre de una canción para buscar.");

  try {
    const { all } = await yts(text);
    if (!all.length) return m.reply("❌ No se encontraron resultados.");
    const video = all[0];

    const { title, thumbnail, url, views, timestamp: duration, ago: uploaded, author } = video;
    const thumb = (await conn.getFile(thumbnail))?.data;

    const info = `「🎵 *${title}* 」
🎤 *Canal:* ${author.name}
👁️ *Vistas:* ${formatViews(views)}
⏱️ *Duración:* ${duration}
📆 *Publicado:* ${uploaded}
🔗 *Link:* ${url}`;

    await conn.sendMessage(m.chat, { image: thumb, caption: info }, { quoted: m });

    if (["play", "yta", "ytmp3"].includes(command)) {
      await m.react("🎧");
      const res = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, {
        audio: { url: res.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${res.title}.mp3`
      }, { quoted: m });
    } else if (["play2", "ytv", "ytmp4"].includes(command)) {
      await m.react("📽️");
      const apis = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      for (let link of apis) {
        try {
          const r = await fetch(link);
          const j = await r.json();
          const dl = j.data?.dl || j.result?.download?.url || j.downloads?.url || j.data?.download?.url;
          if (dl) {
            return await conn.sendMessage(m.chat, {
              video: { url: dl },
              mimetype: "video/mp4",
              fileName: `${title}.mp4`,
              caption: "🎬 Aquí tienes tu video.",
              thumbnail: thumb
            }, { quoted: m });
          }
        } catch { }
      }

      return m.reply("⛔ No se pudo descargar el video. Intenta con otro.");
    } else {
      return m.reply("❌ Comando no reconocido.");
    }

  } catch (e) {
    return m.reply("🚫 Error:\n" + e.message);
  }
};

handler.command = handler.help = ["play", "play2", "yta", "ytmp3", "ytv", "ytmp4"];
handler.tags = ["downloader"];
handler.coin = 0;

export default handler;

function formatViews(views) {
  if (!views) return "Desconocido";
  return views > 1000 ? (views / 1000).toFixed(1) + "k" : views.toString();
}
