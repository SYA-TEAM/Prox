export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return true;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
  if (m.chat === '120363416409380841@newsletter') return true;

  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(
      `> 𝗛𝗼𝗹𝗮 @${m.sender.split`@`[0]} ✨\n\n` +  // Fuente negrita sans serif
      `> Por ahora los comandos solo están activos en grupos.\n` +
      `> Si quieres usar la bot, únete a este grupo:\n` +
      `> \`https://chat.whatsapp.com/GBcSWbfm3JO1HhmbdbnrsH\`\n\n` +  // Fuente monospace
      `> Te esperamos 💖`,
      false,
      { mentions: [m.sender] }
    );
    await this.updateBlockStatus(m.chat, 'block');
  }
  return false;
}