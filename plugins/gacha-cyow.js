const handler = async (m, { conn, command }) => {
  const waifus = [
    {
      nombre: "Rem",
      anime: "Re:Zero",
      frase: "Estaré contigo por siempre... 💙",
      img: "https://i.pinimg.com/originals/2f/90/27/2f90279ef79e6c2f3199b1ebc1678da0.jpg"
    },
    {
      nombre: "Zero Two",
      anime: "Darling in the FranXX",
      frase: "Darling... no me dejes sola. 💋",
      img: "https://i.pinimg.com/originals/f5/79/e8/f579e82c822e7f3c566471d68374aa77.jpg"
    },
    {
      nombre: "Mai Sakurajima",
      anime: "Seishun Buta Yarou",
      frase: "Solo tú puedes verme así... 💞",
      img: "https://i.pinimg.com/originals/5f/b4/29/5fb42962b7e8cc570c8002a2987beac9.jpg"
    },
    {
      nombre: "Kurumi Tokisaki",
      anime: "Date A Live",
      frase: "El tiempo contigo vale la eternidad... 🖤",
      img: "https://i.pinimg.com/originals/e6/79/10/e67910761bbfeec3c76ed639bd2122b7.jpg"
    }
  ];

  const waifu = waifus[Math.floor(Math.random() * waifus.length)];

  const texto = `╭━〔 *💗 Waifu aleatoria* 〕━⬣  
│🌸 *Nombre:* ${waifu.nombre}
│🎬 *Anime:* ${waifu.anime}
│💌 *Frase:* "${waifu.frase}"
╰━━━━━━━⬣`;

  await conn.sendMessage(m.chat, {
    image: { url: waifu.img },
    caption: texto,
    contextInfo: {
      externalAdReply: {
        title: `${waifu.nombre} • ${waifu.anime}`,
        body: waifu.frase,
        thumbnailUrl: waifu.img,
        sourceUrl: 'https://www.pinterest.com', // Puedes poner tu link
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m });
};

handler.help = ['cyow'];
handler.tags = ['anime', 'diversión'];
handler.command = ['cyow'];

export default handler;
