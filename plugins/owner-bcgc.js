const handler = async (m, { conn, text }) => {
  if (!m.sender.endsWith('50493732693@s.whatsapp.net')) {
    throw '❌ Solo el propietario autorizado puede usar este comando.';
  }

  const delay = (time) => new Promise((res) => setTimeout(res, time));
  const getGroups = await conn.groupFetchAllParticipating();
  const groups = Object.entries(getGroups).map((entry) => entry[1]);
  const anu = groups.map((v) => v.id);
  const pesan = m.quoted && m.quoted.text ? m.quoted.text : text;

  if (!pesan) throw '📩 Te faltó el texto.';

  for (const i of anu) {
    await delay(500);
    conn.relayMessage(i,
      {
        liveLocationMessage: {
          degreesLatitude: 35.685506276233525,
          degreesLongitude: 139.75270667105852,
          accuracyInMeters: 0,
          degreesClockwiseFromMagneticNorth: 2,
          caption: '⭐️ M E N S A J E ⭐️\n\n' + pesan + `${packname || ''}`,
          sequenceNumber: 2,
          timeOffset: 3,
          contextInfo: m,
        }
      }, {}).catch((_) => _);
  }

  m.reply(`✅ *Mensaje enviado a:* ${anu.length} *grupo(s)*`);
};

handler.help = ['broadcastgroup', 'bcgc'];
handler.tags = ['owner'];
handler.command = ['bcgc'];

export default handler;