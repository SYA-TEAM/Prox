import yts from "yt-search";
import { ytv, yta } from "./_ytdl.js";
const limit = 100;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
    m.react("🕐")
    let res = await yts(text);
    if (!res || !res.all || res.all.length === 0) {
      return m.reply("No se encontraron resultados para tu búsqueda.");
    }

    let video = res.all[0];
    let total = Number(video.duration.seconds) || 0;

    𝖼𝗈𝗇𝗌𝗍 𝖼𝖺𝗉 = `> ❀ ${𝗏𝗂𝖽𝖾𝗈.𝗍𝗂𝗍𝗅𝖾}
> ➮ 𝖠𝗎𝗍𝗈𝗋 = *${𝗏𝗂𝖽𝖾𝗈.𝖺𝗎𝗍𝗁𝗈𝗋.𝗇𝖺𝗆𝖾}*
> ➮ 𝖣𝗎𝗋𝖺𝖼𝗂𝗈́𝗇 = *${𝗏𝗂𝖽𝖾𝗈.𝖽𝗎𝗋𝖺𝗍𝗂𝗈𝗇.𝗍𝗂𝗆𝖾𝗌𝗍𝖺𝗆𝗉}*
> ➮ 𝖵𝗂𝗌𝗍𝖺𝗌 = *${𝗏𝗂𝖽𝖾𝗈.𝗏𝗂𝖾𝗐𝗌}*
> ➮ 𝖤𝗇𝗅𝖺𝖼𝖾 = *${𝗏𝗂𝖽𝖾𝗈.𝗎𝗋𝗅}*`;
    await conn.sendFile(m.chat, await (await fetch(video.thumbnail)).buffer(), "image.jpg", cap, m);

    if (command === "play") {
      try {
    const api = await yta(video.url)
 await conn.sendFile(m.chat, api.result.download, api.result.title, "", m);
            await m.react("✅");
        } catch (error) {
          return error.message
        }
    } else if (command === "play2" || command === "playvid") {
    try {
      const api = await ytv(video.url)
      const res = await fetch(api.url);
      const cont = res.headers.get('Content-Length');
      const bytes = parseInt(cont, 10);
      const sizemb = bytes / (1024 * 1024);
      const doc = sizemb >= limit;
 await conn.sendFile(m.chat, api.url, api.title, "", m, null, { asDocument: doc, mimetype: "video/mp4" });
            await m.react("✔️");
        } catch (error) {
          return error.message
        }
    }
}
handler.help = ["play", "play2"];
handler.tags = ["download"];
handler.command = ["play"];
export default handler;
