import chalk from 'chalk';
let WAMessageStubType = (await import("@whiskeysockets/baileys")).default;
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';
import './_content.js';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
    if (!m.messageStubType || !m.isGroup) return;

    let usuario = `@${m.sender.split`@`[0]}`;
    let chat = global.db.data.chats[m.chat];
    let users = participants.map(u => conn.decodeJid(u.id));
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');
    const groupName = (await conn.groupMetadata(m.chat)).subject;

    let fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    if (chat.detect && m.messageStubType == 2) {
        const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0];
        const sessionPath = './GataBotSession/';
        for (const file of await fs.readdir(sessionPath)) {
            if (file.includes(uniqid)) {
                await fs.unlink(path.join(sessionPath, file));
                console.log(`${chalk.yellow.bold('[ ⚠️ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
                `${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`);
            }
        }
    }

    if (chat.detect && m.messageStubType == 21) {
        await this.sendMessage(m.chat, { text: `${usuario} 𝙃𝘼𝙎 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀́ 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 𝘼:\n\n*${m.messageStubParameters[0]}*`, mentions: [m.sender] }, { quoted: fkontak });   
    } else if (chat.detect && m.messageStubType == 22) {
        await this.sendMessage(m.chat, { text: `${usuario} 𝙃𝘼𝙎 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙇𝘼𝙎 𝙁𝙊𝙏𝙊 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊`, mentions: [m.sender] }, { quoted: fkontak });  
    } else if (chat.detect && m.messageStubType == 24) {
        await this.sendMessage(m.chat, { text: `${usuario} 𝙉𝙐𝙀𝙑𝘼 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 𝙀𝙎:\n\n${m.messageStubParameters[0]}`, mentions: [m.sender] }, { quoted: fkontak }); 
    } else if (chat.detect && m.messageStubType == 25) {
        await this.sendMessage(m.chat, { text: `🔒 𝘼𝙃𝙊𝙍𝘼 *${m.messageStubParameters[0] == 'on' ? '𝙎𝙊𝙇𝙊 𝘼𝘿𝙈𝙄𝙉𝙎' : '𝙏𝙊𝘿𝙊𝙎'}* 𝙋𝙐𝙀𝘿�� 𝙀𝘿𝙄𝙏𝘼𝙍 𝙇𝘼 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊`, mentions: [m.sender] }, { quoted: fkontak }); 
    } else if (chat.detect && m.messageStubType == 26) {
        await this.sendMessage(m.chat, { text: `${m.messageStubParameters[0] == 'on' ? '❱❱ 𝙂𝙍𝙐𝙋𝙊 𝘾𝙀𝙍𝙍𝘼𝘿𝙊 ❰❰' : '❱❱ 𝙂𝙍𝙐𝙋𝙊 𝘼𝘽𝙄𝙀𝙍𝙏𝙊 ❰❰'}\n\n ${groupName}\n ${m.messageStubParameters[0] == 'on' ? '» 𝙄𝙉𝙃𝘼𝘽𝙄𝙇𝙄𝙏𝘼𝘿𝙊 𝙋𝙊𝙍:'  : '» 𝙃𝘼𝘽𝙄𝙇𝙄𝙏𝘼𝘿𝙊 𝙋𝙊𝙍:'} *${m.messageStubParameters[0] == 'on' ? 'ㅤ' : 'ㅤ' }*\n 👤 *${usuario}*\n\n ${m.messageStubParameters[0] == 'on' ?'» 𝙉𝘼𝘿𝙄𝙀 𝙋𝙐𝙀𝘿𝙀 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙀𝙉 𝙀𝙇 𝙂𝙍𝙐𝙋𝙊.' :'» 𝙏𝙊𝘿𝙊𝙎 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙀𝙉 𝙀𝙇 𝙂𝙍𝙐𝙋𝙊.'}`, mentions: [m.sender] }, { quoted: fkontak });
    } else if (chat.detect && m.messageStubType == 29) {
        await this.sendMessage(m.chat, { text: `❱❱ 𝙁𝙀𝙇𝙄𝘾𝙄𝘿𝘼𝘿𝙀𝙎 ❰❰\n\n👤 *@${m.messageStubParameters[0].split`@`[0]}* \n» 𝘼𝙃𝙊𝙍𝘼 𝙀𝙎 𝘼𝘿𝙈𝙄𝙉.\n\n» 𝘼𝘾𝘾𝙄𝙊́𝙉 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝘿𝘼 𝙋𝙊𝙍: \n👤 *${usuario}*`, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak }); 
    } else if (chat.detect && m.messageStubType == 30) {
        await this.sendMessage(m.chat, { text: `❱❱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉 ❰❰\n\n👤 *@${m.messageStubParameters[0].split`@`[0]}* \n» 𝙔𝘼 𝙉𝙊 𝙀𝙎 𝘼𝘿𝙈𝙄𝙉.\n\n» 𝘼𝘾𝘾𝙄𝙊́𝙉 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝘿𝘼 𝙋𝙊𝙍:\n👤 *${usuario}*`, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak });
    } else if (chat.detect && m.messageStubType == 72) {
        await this.sendMessage(m.chat, { text: `${usuario} 𝘾𝘼𝙈𝘽𝙄𝙊 𝙇𝘼𝙎 𝘿𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙇𝙊𝙎 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇𝙀𝙎 𝘼 *@${m.messageStubParameters[0]}*`, mentions: [m.sender] }, { quoted: fkontak });
    } else if (chat.detect && m.messageStubType == 123) {
        await this.sendMessage(m.chat, { text: `${usuario} *𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝙊́* 𝙇𝙊𝙎 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇.`, mentions: [m.sender] }, { quoted: fkontak });
    } else if (chat.detect && m.messageStubType === 172 && m.messageStubParameters.length > 0) {
        const rawUser = m.messageStubParameters[0];
        const users = rawUser.split('@')[0]; 
        const prefijosProhibidos = ['91', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '212'];
        const usersConPrefijo = users.startsWith('+') ? users : `+${users}`;

        if (chat.antifake && isBotAdmin) {
            if (prefijosProhibidos.some(prefijo => usersConPrefijo.startsWith(prefijo))) {
                try {
                    await conn.groupRequestParticipantsUpdate(m.chat, [rawUser], 'reject');
                    console.log(`Solicitud de ingreso de ${usersConPrefijo} rechazada automáticamente por tener un prefijo prohibido.`);
                } catch (error) {
                    console.error(`Error al rechazar la solicitud de ${usersConPrefijo}:`, error);
                }
            } else {
                try {
                    await conn.groupRequestParticipantsUpdate(m.chat, [rawUser], 'approve');
                    console.log(`Solicitud de ingreso de ${usersConPrefijo} aprobada automáticamente.`);
                } catch (error) {
                    console.error(`Error al aprobar la solicitud de ${usersConPrefijo}:`, error);
                }
            }
        } else {
            try {
                await conn.groupRequestParticipantsUpdate(m.chat, [rawUser], 'approve');
                console.log(`Solicitud de ingreso de ${usersConPrefijo} aprobada automáticamente ya que #antifake está desactivado.`);
            } catch (error) {
                console.error(`Error al aprobar la solicitud de ${usersConPrefijo}:`, error);
            }
        }
        return;
    } else {
        if (m.messageStubType == 2) return;
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType],
        });
    }
}

export default handler;
