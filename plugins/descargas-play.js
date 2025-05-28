// YouTube Play : mp3 & mp4
// Free API : https://api.sylphy.xyz
// YTDL : https://ytdl.sylphy.xyz
import { createCanvas, loadImage } from 'canvas';
import { getAverageColor } from 'fast-average-color-node';

const limit = 10;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
  try {
    m.react("🌱")
    let res = await yts(text);
    let video = res.all[0];
    let total = Number(video.duration.seconds) || 0;
    if (total < 31) total = 60;
    const current = Math.floor(Math.random() * (total - 30 + 1)) + 30;
    let buff = await create(video.thumbnail, video.title, video.author.name, current, total);
    const cap = `
\`\`\`⊜─⌈ 📻 ◜YouTube Play◞ 📻 ⌋─⊜\`\`\`

≡ 🌿 \`Título\` : » ${video.title}
≡ 🌾 \`Author\` : » ${video.author.name}
≡ 🌱 \`Duración\` : » ${video.duration.timestamp}
≡ 🌴 \`Vistas\` : » ${video.views}
≡ ☘️ \`URL\`      : » ${video.url}
`;
    await conn.sendFile(m.chat, buff, "image.jpg", cap, m);

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
handler.command = ["play2", "playvid"];
export default handler;

function formatTime(sec) {
  const min = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${min}:${s}`
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const testLine = line + word + ' '
    const { width } = ctx.measureText(testLine)
    if (width > maxWidth && line) {
      lines.push(line.trim())
      line = word + ' '
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line.trim())
  return lines
}

async function create(imageUrl, title, author, currentSec, totalSec) {
  const canvas = createCanvas(720, 900)
  const ctx = canvas.getContext('2d')

  const res = await fetch(imageUrl)
  const buffer = await res.buffer()
  const img = await loadImage(buffer)

  const { value: [r, g, b] } = await getAverageColor(buffer)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, `rgb(${r + 20}, ${g + 20}, ${b + 20})`)
  gradient.addColorStop(1, `rgb(${r}, ${g}, ${b})`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const side = Math.min(img.width, img.height)
  const sx = (img.width - side) / 2
  const sy = (img.height - side) / 2
  ctx.drawImage(img, sx, sy, side, side, 60, 60, 600, 600)

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 38px sans-serif'
  ctx.textAlign = 'center'

  const maxWidth = 620
  const lines = wrapText(ctx, title, maxWidth)
  const startY = 720
  const lineHeight = 42

  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, startY + i * lineHeight)
  })

  ctx.font = '28px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText(author, canvas.width / 2, startY + lines.length * lineHeight + 5)

  const barX = 80
  const barY = 830 + (lines.length - 1) * 20
  const barW = 560
  const barH = 6
  const progress = Math.min(currentSec / totalSec, 1)

  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillRect(barX, barY, barW, barH)
  ctx.fillStyle = '#fff'
  ctx.fillRect(barX, barY, barW * progress, barH)

  ctx.font = '20px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(formatTime(currentSec), barX, barY + 25)
  ctx.textAlign = 'right'
  ctx.fillText(formatTime(totalSec), barX + barW, barY + 25)

  const mark = Buffer.from('wqkgSSdtIEZ6IH4=', 'base64').toString()
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114)
  const wmColor = luminance < 128 ? 'rgba(255,255,255,0.12)' : 'rgba(30,30,30,0.12)'

  ctx.save()
  ctx.font = 'bold 13px monospace'
  ctx.fillStyle = wmColor
  ctx.textAlign = 'left'
  ctx.fillText(mark, 12, 18)
  ctx.restore()

  return canvas.toBuffer('image/png')
}
