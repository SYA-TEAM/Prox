const waifus = [
  {
    nombre: 'Zero Two',
    anime: 'Darling in the FranXX',
    img: 'https://i.pinimg.com/originals/3f/13/b8/3f13b859c0e9a63c315ffb8f2dd46f3e.jpg',
    frase: 'Darling~ ¿me extrañaste? 💞'
  },
  {
    nombre: 'Rem',
    anime: 'Re:Zero',
    img: 'https://i.pinimg.com/originals/36/f9/b4/36f9b4dbb7cf0e17bd76233ce9b6b7f6.jpg',
    frase: 'Estaré contigo por siempre... 💙'
  },
  {
    nombre: 'Yor Forger',
    anime: 'Spy x Family',
    img: 'https://i.pinimg.com/originals/9f/d4/79/9fd479c2c4ea5f4c0b6f7686a9e212b6.jpg',
    frase: '¿Una cita... conmigo? ❤️'
  },
  {
    nombre: 'Shinobu Kocho',
    anime: 'Kimetsu no Yaiba',
    img: 'https://i.pinimg.com/originals/47/2d/1b/472d1b2cf69ef0340349e8c410d17c9e.jpg',
    frase: '¿Quieres que te prepare un té con veneno? 💜'
  },
  {
    nombre: 'Anya Forger',
    anime: 'Spy x Family',
    img: 'https://i.pinimg.com/originals/f4/64/53/f4645357466c278cddca4be88d66a7f6.jpg',
    frase: 'Heh~ ¡elegante! 🌟'
  }
]

const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('🌸 Cita un mensaje para obtener una waifu personalizada.');

  const waifu = waifus[Math.floor(Math.random() * waifus.length)];

  const texto = `🌸 *¡Has sido emparejad@ con...!*  
╭───────๑🌸๑───────╮  
💖 *Waifu:* ${waifu.nombre}  
🎬 *Anime:* ${waifu.anime}  
💌 *Frase:* "${waifu.frase}"  
╰───────๑🌸๑───────╯`;

  await conn.sendMessage(m.chat, {
    image: { url: waifu.img },
    caption: texto,
    contextInfo: {
      externalAdReply: {
        title: `💗 ${waifu.nombre} - ${waifu.anime}`,
        body: waifu.frase,
        thumbnailUrl: waifu.img,
        sourceUrl: 'https://mywaifus.com/',
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m.quoted });
};

handler.command = ['cyow'];
handler.help = ['cyow'];
handler.tags = ['fun'];

export default handler;
