// start-jadibot.js
// Este script inicia un Jadibot (sub-bot) como un proceso independiente.

Process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason, jidNormalizedUser, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import P from 'pino'
import { Boom } from '@hapi/boom'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import path, { join, dirname } from 'path'
import chalk from 'chalk'
import { createRequire } from 'module'
import store from './lib/store.js' // Asegúrate de que 'lib/store.js' sea accesible desde aquí

// Definiciones globales para este proceso de Jadibot
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
};
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

// Obtener la ruta de la sesión del Jadibot desde los argumentos de la línea de comandos
const pathYukiJadiBot = process.argv[2];

if (!pathYukiJadiBot) {
    console.error(chalk.bold.red('Error: La ruta de la sesión del Jadibot no fue proporcionada.'));
    process.exit(1); // Sale si no se proporciona la ruta
}

console.log(chalk.bold.magentaBright(`\n✰ Iniciando Jadibot para sesión: ${pathYukiJadiBot} ✰\n`));

async function startJadibot() {
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        logger: P({ level: 'silent' }), // Logger silencioso
        printQRInTerminal: false, // Los Jadibots no suelen mostrar QR en terminal
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        mobile: false, // Configura según si este Jadibot debe ser móvil
        browser: [`YukiBot-Jadibot (${path.basename(pathYukiJadiBot)})`, 'Edge', '20.0.04'], // Nombre único para el navegador del Jadibot
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (clave) => {
            let jid = jidNormalizedUser(clave.remoteJid)
            // Aquí puedes necesitar un 'store' específico para este Jadibot o un 'store' compartido
            // que pueda manejar mensajes de múltiples conexiones de forma segura.
            // Para simplificar, usamos el 'store' global que importamos.
            let msg = await store.loadMessage(jid, clave.id) 
            return msg?.message || ""
        },
        version,
    };

    const conn = makeWASocket(connectionOptions);

    // Importar el manejador de mensajes (handler)
    // Se asume que handler.js exporta una función que puede ser llamada con `this` como la conexión,
    // o que acepta la conexión como primer argumento.
    const { handler } = await import('./handler.js'); // Asegúrate de que handler.js es accesible

    const connectionUpdate = async (update) => {
        const { connection, lastDisconnect, isNewLogin } = update;

        if (isNewLogin) {
            console.log(chalk.bold.green(`\n❀ Jadibot (${path.basename(pathYukiJadiBot)}) conectado con éxito ❀`));
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            console.log(chalk.bold.yellow(`Jadibot (${path.basename(pathYukiJadiBot)}): Conexión cerrada. Razón: ${reason || 'Desconocida'}. Reintentando...`));

            if (reason === DisconnectReason.badSession || reason === DisconnectReason.loggedOut) {
                console.log(chalk.bold.redBright(`\n⚠︎ Jadibot (${path.basename(pathYukiJadiBot)}): SESIÓN INVALIDADA. Elimina la carpeta '${pathYukiJadiBot}' y escanea un nuevo QR. Deteniendo proceso. ⚠︎`));
                try {
                    // Opcional: Eliminar creds.json si la sesión es inválida
                    // unlinkSync(join(pathYukiJadiBot, 'creds.json'));
                } catch (e) {
                    // console.error(`Error al intentar eliminar creds.json: ${e.message}`);
                }
                process.exit(1); // Sale del proceso para que el sistema externo (si lo hay) lo maneje
            } else {
                // Para otras razones, intentar reiniciar la conexión de forma limpia
                conn.ev.removeAllListeners(); // Limpiar listeners antes de un nuevo intento
                startJadibot(); // Intenta iniciar una nueva conexión para este Jadibot
            }
        } else if (connection === 'open') {
            console.log(chalk.bold.green(`Jadibot (${path.basename(pathYukiJadiBot)}): Conexión abierta.`));
        }
    };

    // Asignar los manejadores de eventos a esta instancia de conexión
    conn.ev.on('messages.upsert', async (m) => {
        // Asegúrate de que tu `handler.js` pueda procesar mensajes con `conn` como contexto
        // Si tu handler usa `this.sendMessage`, entonces `handler.call(conn, m)` es correcto.
        // Si tu handler acepta `conn` como primer argumento, sería `handler(conn, m)`.
        await handler.call(conn, m); 
    });
    conn.ev.on('connection.update', connectionUpdate);
    conn.ev.on('creds.update', saveCreds);

    // Puedes añadir lógica de limpieza de archivos temporales específica para este Jadibot si lo necesitas
    // Por ejemplo, setInterval para limpiar una carpeta 'tmp' dentro de 'pathYukiJadiBot'
    process.on('uncaughtException', (err) => {
        console.error(chalk.bold.red(`Excepción no capturada en Jadibot (${path.basename(pathYukiJadiBot)}):`), err);
        // Si ocurre un error no capturado, el proceso del Jadibot se cerrará.
        // El script principal (`index.js`) puede implementar una lógica para reiniciarlo.
        process.exit(1); 
    });
}

// Iniciar el Jadibot cuando se ejecuta este script
startJadibot().catch(err => {
    console.error(chalk.bold.red(`Error fatal al iniciar Jadibot para ${pathYukiJadiBot}:`), err);
    process.exit(1);
});
