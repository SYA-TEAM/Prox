import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `🐸 Por favor responde a un archivo válido (imagen, video, html, etc).`, m);

  await m.react('📦');

  try {
    let media = await q.download();
    let linkData = await maybox(media, mime);

    if (!linkData?.data?.url) throw '❌ Error al subir';

    let txt = `*乂 W I R K S I B O X - U P L O A D E R 乂 *\n\n`;
    txt += `*» Archivo:* ${linkData.data.originalName}\n`;
    txt += `*» Tamaño:* ${formatBytes(linkData.data.size)}\n`;
    txt += `*» Subido:* ${new Date(linkData.data.uploadedAt).toLocaleString()}\n`;
    txt += `*» Enlace:* ${linkData.data.url}\n\n`;
    txt += `> Powered By Wirk`;

    await conn.sendFile(m.chat, media, linkData.data.fileName, txt, m);
    await m.react('✅');
  } catch (err) {
    console.error(err);
    await m.react('❌');
    await conn.reply(m.chat, `(⁠っ⁠-⁠ ‿⁠-⁠)⁠っ Hubo un error subiendo el archivo a MayBox...`, m);
  }
};

handler.help = ['maybox'];
handler.tags = ['uploader'];
handler.command = ['box'];
export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function maybox(content, mime) {
  const { ext } = (await fileTypeFromBuffer(content)) || { ext: 'bin' };
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const form = new FormData();
  const filename = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
  form.append('file', blob, filename);

  const res = await fetch('https://wirksi-box.vercel.app', {
    method: 'POST',
    body: form,
    headers: {
      'User-Agent': 'MaycolAIUltraMD',
    }
  });

  return await res.json();
                                   }
