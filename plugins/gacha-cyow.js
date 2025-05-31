const waifus = [
  {
    nombre: 'Zero Two',
    anime: 'Darling in the FranXX',
    img: 'https://i.imgur.com/VgHRbjh.jpg',
    frase: 'Darling~ ¿me extrañaste?',
  },
  {
    nombre: 'Rem',
    anime: 'Re:Zero',
    img: 'https://i.imgur.com/hxO5sre.jpg',
    frase: 'Estaré contigo por siempre...',
  },
  {
    nombre: 'Yor Forger',
    anime: 'Spy x Family',
    img: 'https://i.imgur.com/fyqVgJZ.jpg',
    frase: '¿Una cita... conmigo?',
  },
  {
    nombre: 'Shinobu Kocho',
    anime: 'Kimetsu no Yaiba',
    img: 'https://i.imgur.com/hcZMuZQ.jpg',
    frase: '¿Quieres que te prepare un té con veneno? 💜',
  },
  {
    nombre: 'Anya Forger',
    anime: 'Spy x Family',
    img: 'https://i.imgur.com/Oy2fqgM.jpg',
    frase: 'Heh~ elegante.',
  }
];

const handler = async (m, { conn, command }) => {
  const waifu = waifus[Math.floor(Math.random() * waifus.length)];

  const texto = `*💘 Cita aleatoria activada...*

✿ *Waifu:* ${waifu.nombre}
🌸 *Anime:* ${waifu.anime}
💬 *Frase:* "${waifu.frase}"

✨ *¿Qué te parece tu nueva waifu? Usa #cyow para obtener otra.*`;

  await conn.sendFile(m.chat, waifu.img, 'waifu.jpg', texto, m, null, {
    contextInfo: {
      externalAdReply: {
        title: `Tu waifu: ${waifu.nombre}`,
        body: '✨ Comando exclusivo de Anónimo',
        thumbnailUrl: waifu.img,
        sourceUrl: 'https://waifulist.moe',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });
};

handler.help = ['cyow'];
handler.tags = ['anime', 'waifu'];
handler.command = ['cyow'];

export default handler;
