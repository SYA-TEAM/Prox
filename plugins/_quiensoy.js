const handler = async (m, { conn }) => {
    const userNumber = m.sender || ''; // Asegura que siempre haya algo
    const numeroSinArroba = userNumber.split('@')[0] || 'Desconocido';

    await conn.sendMessage(
        m.chat,
        {
            text: `🤍 Tu número es:\n${userNumber}\n\n📍 Solo la parte antes de @ es: ${numeroSinArroba}`
        },
        { quoted: m }
    );
};

handler.help = ['quiensoy'];
handler.tags = ['info'];
handler.command = ['quiensoy'];

export default handler;