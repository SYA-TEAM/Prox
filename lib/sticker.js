import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { ffmpeg } from './converter.js'
import fluent_ffmpeg from 'fluent-ffmpeg'
import { spawn } from 'child_process'
import uploadFile from './uploadFile.js'
import uploadImage from './uploadImage.js'
import { fileTypeFromBuffer } from 'file-type'
import webp from 'node-webpmux'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tmp = path.join(__dirname, '../tmp')

async function fetchBuffer(url) {
  try {
    let res = await fetch(url)
    if (res.status !== 200) throw new Error(await res.text())
    return await res.buffer()
  } catch (e) {
    throw new Error(`Error fetching url: ${url} - ${e.message}`)
  }
}

function queryURL(queries) {
  return new URLSearchParams(Object.entries(queries))
}

/** sticker2: usa spawn ffmpeg + gm o magick */
function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) img = await fetchBuffer(url)
      let inp = path.join(tmp, +new Date() + '.jpeg')
      await fs.promises.writeFile(inp, img)

      let ff = spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',
        '-'
      ])

      ff.on('error', reject)
      ff.on('close', async () => {
        try { await fs.promises.unlink(inp) } catch {}
      })

      let bufs = []
      // Detect si está disponible gm o magick
      const _spawnprocess = global.gm ? 'gm' : global.magick ? 'magick' : null
      if (!_spawnprocess) return reject(new Error('Neither gm nor magick found'))
      let im = spawn(_spawnprocess, ['convert', 'png:-', 'webp:-'])

      im.on('error', e => reject(e))
      im.stdout.on('data', chunk => bufs.push(chunk))
      im.on('exit', () => resolve(Buffer.concat(bufs)))

      ff.stdout.pipe(im.stdin)
    } catch (e) {
      reject(e)
    }
  })
}

/** sticker1: usa canvas remoto */
async function sticker1(img, url) {
  if (url) url = url
  else url = await uploadImage(img)
  let { mime } = url ? { mime: 'image/jpeg' } : await fileTypeFromBuffer(img)
  let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
let max = Math.max(im.width, im.height)
let w = 512 * im.width / max
let h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`
  return await canvas(sc, 'webp')
}

async function canvas(code, type = 'png', quality = 0.92) {
  let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
    type,
    quality
  }), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': code.length
    },
    body: code
  })
  if (res.status !== 200) throw new Error(`Canvas API error: ${await res.text()}`)
  return await res.buffer()
}

/** sticker3: usa API xteam.xyz */
async function sticker3(img, url, packname, author) {
  if (!url) url = await uploadFile(img)
  let res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams({
    url,
    packname,
    author
  }))
  if (res.status !== 200) throw new Error(`Sticker3 API error: ${await res.text()}`)
  return await res.buffer()
}

/** sticker4: usa ffmpeg de converter.js */
async function sticker4(img, url) {
  if (url) img = await fetchBuffer(url)
  return await ffmpeg(img, [
    '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
  ], 'jpeg', 'webp')
}

/** sticker5: usa wa-sticker-formatter */
async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
  const { Sticker } = await import('wa-sticker-formatter')
  const stickerMetadata = {
    type: 'default',
    pack: packname,
    author,
    categories,
    ...extra
  }
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

/** sticker6: usa fluent-ffmpeg */
function sticker6(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) img = await fetchBuffer(url)
      const type = await fileTypeFromBuffer(img) || { mime: 'application/octet-stream', ext: 'bin' }
      if (type.ext === 'bin') return reject(new Error('File type not supported'))

      const tmpFile = path.join(__dirname, `../tmp/${+new Date()}.${type.ext}`)
      const outFile = tmpFile + '.webp'

      await fs.promises.writeFile(tmpFile, img)

      let Fffmpeg = fluent_ffmpeg(tmpFile)

      Fffmpeg
        .on('error', async (err) => {
          console.error(err)
          try { await fs.promises.unlink(tmpFile) } catch {}
          try { await fs.promises.unlink(outFile) } catch {}
          reject(err)
        })
        .on('end', async () => {
          try {
            let data = await fs.promises.readFile(outFile)
            await fs.promises.unlink(tmpFile)
            await fs.promises.unlink(outFile)
            resolve(data)
          } catch (e) {
            reject(e)
          }
        })
        .addOutputOptions([
          '-vcodec', 'libwebp',
          '-vf',
          "scale='min(320,iw)':min='min(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
        ])
        .toFormat('webp')
        .save(outFile)
    } catch (e) {
      reject(e)
    }
  })
}

/** addExif para metadatos */
async function addExif(stiker, packname = '', author = '') {
  if (!packname && !author) return stiker
  const img = new webp.Image()
  await img.load(stiker)
  const json = {
    'sticker-pack-id': 'com.example',
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
  }
  const exifAttr = Buffer.from(JSON.stringify(json), 'utf8')
  const exif = Buffer.alloc(exifAttr.length + 2)
  exif.write('RIFF', 0)
  exif.writeUInt16LE(exifAttr.length, 4)
  exifAttr.copy(exif, 6)
  img.exif = exif
  return await img.save(null)
}

export default {
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  addExif
}
