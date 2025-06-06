import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
    const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);  
    const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);  
    const isCommand3 = /^(bots|sockets|socket)$/i.test(command);   

    async function reportError(e) {
        await m.reply(`${msm} Ocurrió un error.`);
        console.log(e);
    }

    switch (true) {
        case isCommand1:
            let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
            let uniqid = `${who.split`@`[0]}`;
            const path = `./${jadi}/${uniqid}`;

            if (!await fs.existsSync(path)) {
                await conn.sendMessage(m.chat, { text: `${emoji} Usted no tiene una sesión, puede crear una usando:\n${usedPrefix + command}\n\nSi tiene una *(ID)* puede usar para saltarse el paso anterior usando:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`` }, { quoted: m });
                return;
            }
            if (global.conn.user.jid !== conn.user.jid) return conn.sendMessage(m.chat, {
                text: `${emoji2} Use este comando al *Bot* principal.\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`
            }, { quoted: m }); 
            else {
                await conn.sendMessage(m.chat, { text: `${emoji} Tu sesión como *Sub-Bot* se ha eliminado` }, { quoted: m });
            }
            try {
                fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true });
                await conn.sendMessage(m.chat, { text : `${emoji3} Ha cerrado sesión y borrado todo rastro.` }, { quoted: m });
            } catch (e) {
                reportError(e);
            }
            break;

        case isCommand2:
            if (global.conn.user.jid == conn.user.jid) {
                conn.reply(m.chat, `${emoji} Si no es *Sub-Bot* comuníquese al número principal del *Bot* para ser *Sub-Bot*.`, m);
            } else {
                await conn.reply(m.chat, `${emoji} ${botname} desactivada.`, m);
                conn.ws.close();
            }
            break;

        case isCommand3:
            // Lista de conexiones activas (sub-bots) excluyendo el bot principal
            const allConns = [...new Set(global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED))];
            const mainBotJid = global.conn.user.jid;
            const subBots = allConns.filter(c => c.user.jid !== mainBotJid);

            // Crear lista de sub bots con sus números
            const subBotsList = subBots.map((u, i) => `✦ ${i + 1}. wa.me/${u.user.jid.split`@`[0]}`).join('\n');

            const replyMessage = subBots.length === 0
                ? `No hay Sub-Bots disponibles por el momento.`
                : `
🤍 Para ser un subbot usa el comando *#code*\n\n✧ *Sub-Bots conectados: ${subBots.length}*\n${subBotsList}\n\n${wm}`;

            const responseMessage = (mainBotJid === conn.user.jid)
                ? `*「✿」Subbots Activos Actualmente*\n${replyMessage}`
                : `${emoji} *ESTE ES UN SUB-BOT*\n${replyMessage}`;

            await _envio.sendMessage(m.chat, {
                text: responseMessage,
                mentions: _envio.parseMention(responseMessage)
            }, { quoted: m });
            break;
    }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;
