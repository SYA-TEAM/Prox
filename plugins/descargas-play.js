// YouTube Play : mp3 & mp4
// Free API : https://api.sylphy.xyz
// YTDL : https://ytdl.sylphy.xyz
const limit = 10;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");

  try {
    m.react("🌱");
    let res = await yts(text);
    let video = res.all[0];

    const caption = `
\`\`\`⊜─⌈ 📻 ◜YouTube Play◞ 📻 ⌋─⊜\`\`\`

≡ 🌿 \`Título\` : » ${video.title}
≡ 🌾 \`Author\` : » ${video.author.name}
≡ 🌱 \`Duración\` : » ${video.duration.timestamp}
≡ 🌴 \`Vistas\` : » ${video.views}
≡ ☘️ \`URL\`      : » ${video.url}
`;

    // Enviamos directamente la imagen del thumbnail sin usar canvas
    await conn.sendFile(m.chat, video.thumbnail, 'thumbnail.jpg', caption, m);

    if (command === "play") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp3?url=${video.url}&quality=128`)).json();
      await conn.sendFile(m.chat, api.data.dl_url, api.data.title, "", m);
      await m.react("✔️");
    } else if (command === "play2" || command === "playvid") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`)).json();
      const doc = api.data.size_mb >= limit;
      await conn.sendFile(m.chat, api.data.dl_url, api.data.title, "", m, null, { asDocument: doc });
      await m.react("✔️");
    }
  } catch (e) {
    throw e;
  }
};

handler.help = ["play", "play2"];
handler.tags = ["dl"];
handler.command = ["play", "play2", "playvid"];
export default handler;