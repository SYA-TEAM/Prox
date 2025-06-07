import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//*─ׄ─ׅ─ׄ─⭒─ CONFIGURACIÓN DEL BOT ─⭒─ׄ─ׅ─ׄ─*

global.botNumber = ''; // Puedes poner tu número aquí para evitar escribirlo cada vez (solo si usas código de sesión con 8 dígitos)

// Lista de propietarios
global.owner = [
  ['50493732693', '🜲 Propietario 🜲', true],
  ['50493732693@s.whatsapp.net'],
  ['5219541690054'],
  ['5214811527445'],
  ['5216671548329']
];

global.mods = []; // Mods del bot
global.suittag = ['50493732693']; // Usuarios con privilegios
global.prems = []; // Premiums

// Info del bot
global.libreria = 'Baileys';
global.baileys = 'V 6.7.16';
global.vs = '2.2.0';
global.nameqr = 'AnyaBot-MD';
global.namebot = '✿◟ᴀɴʏᴀ-ꜰᴏʀɢᴇʀ-ʙᴏᴛ◞✿';
global.sessions = 'Sessions';
global.jadi = 'JadiBots';
global.yukiJadibts = true;

// Etiquetas y firma
global.packname = '✿ ᴀɴʏᴀ ꜰᴏʀɢᴇʀ ✿';
global.botname = '❀ ᴀɴʏᴀ-ꜰᴏʀɢᴇʀ ❀';
global.wm = '↬ ᴀɴʏᴀ ꜰᴏʀɢᴇʀ • ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴡɪʀᴋ';
global.author = 'ᴍᴀᴅᴇ ʙʏ ᴡɪʀᴋ';
global.dev = 'ᴅᴇᴠ﹕ᴡɪʀᴋ | ᴀɴʏᴀ ꜱʏꜱ';
global.textbot = '✧ ᴀɴʏᴀ ʙᴏᴛ • ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴡɪʀᴋ ✧';
global.etiqueta = '✦ ᴡɪʀᴋ';

// Bienvenida y multimedia
global.moneda = '✿ 𝖢𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾𝗌 ✿';
global.welcom1 = '❍ Edita Con El Comando setwelcome';
global.welcom2 = '❍ Edita Con El Comando setbye';
global.banner = 'https://qu.ax/YKqoa.jpg';
global.avatar = 'https://qu.ax/AbbjX.jpg';

// Grupos y canales
global.gp1 = 'https://chat.whatsapp.com/CDw7hpI30WjCyKFAVLHNhZ';
global.comunidad1 = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa';
global.channel = 'https://whatsapp.com/channel/0029VbAfPu9BqbrEMFWXKE0d';
global.channel2 = 'https://whatsapp.com/channel/0029VbAfPu9BqbrEMFWXKE0d';
global.md = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot';
global.correo = 'thekingdestroy507@gmail.com';
global.cn = 'https://whatsapp.com/channel/0029VapSIvR5EjxsD1B7hU3T';

// Catálogo y estilo
global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: global.packname,
      orderTitle: 'Bang',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net'
    }
  }
};

global.ch = {
  ch1: '120363416409380841@newsletter',
};
global.multiplier = 70;

// Exportar librerías para uso global
global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

// Watch del archivo para recarga automática
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'settings.js'"));
  import(`${file}?update=${Date.now()}`);
});
