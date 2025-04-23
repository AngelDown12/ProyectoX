import chalk from 'chalk';
let WAMessageStubType = (await import("@whiskeysockets/baileys")).default;
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';
import './_content.js';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return;
    
    let chat = global.db.data.chats[m.chat];
    if (!chat || !chat.detect) return; // Verificar si el chat existe y tiene detect activado
    
    const fkontak = { 
      "key": { 
        "participants": "0@s.whatsapp.net", 
        "remoteJid": "status@broadcast", 
        "fromMe": false, 
        "id": "Halo" 
      }, 
      "message": { 
        "contactMessage": { 
          "vcard": `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD` 
        }
      }, 
      "participant": "0@s.whatsapp.net"
    }
    
    let usuario = `@${m.sender.split`@`[0]}`
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

    // Diseños con estilo Astro-Bot
    let nombre = `
╔═【 🚀 BARBOZA-BOT ALERTA 】═╗
║ *${usuario}* ha reconfigurado el cosmos del grupo.
║ ✨ Nuevo nombre detectado:
║   » *<${m.messageStubParameters[0]}>*
╚════════════════════════╝`
    
    let foto = `
╔═【 🪐 BARBOZA-BOT OBSERVA 】═╗
║ *${usuario}* ha reprogramado la imagen del universo.
║ 📸 Nueva imagen aplicada al grupo.
╚════════════════════════╝`
    
    let edit = `
╔═【 💫 BARBOZA-BOT CONFIG 】═╗
║ *${usuario}* ha modificado los protocolos.
║ Configuración actual: ${m.messageStubParameters[0] == 'on' ? 'Solo administradores' : 'Todos'}
╚═══════════════════════╝`
    
    let newlink = `
╔══【🔗 BARBOZA-BOT LINK 】══╗
║ El portal ha sido reiniciado por:
║   » *${usuario}*
╚═══════════════════════╝`
    
    let status = `
╔═【🔓 BARBOZA-BOT STATUS 】═╗
║ El grupo se encuentra ahora ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'}.
║ Acción realizada por: *${usuario}*
║ Configuración: ${m.messageStubParameters[0] == 'on' ? 'Solo administradores' : 'Todos'}
╚═══════════════════════╝`
    
    let admingp = `
╔═【 👑 BARBOZA-BOT ADMIN 】═╗
║ *${m.messageStubParameters[0].split`@`[0]}* ha sido ascendido al Olimpo de los administradores.
║ Operación ejecutada por: *${usuario}*
╚═══════════════════════╝`
    
    let noadmingp = `
╔═【⚠️ BARBOZA-BOT REMOCIÓN】═╗
║ *${m.messageStubParameters[0].split`@`[0]}* ha descendido de su trono de administrador.
║ Acción realizada por: *${usuario}*
╚═══════════════════════╝`

    // Función auxiliar para enviar mensajes con manejo de errores
    const sendMessageWithRetry = async (content, options = {}) => {
      try {
        await conn.sendMessage(m.chat, content, options);
      } catch (error) {
        console.error(chalk.red(`Error al enviar mensaje en el grupo ${m.chat}:`), error);
        // Intentar enviar un mensaje más simple si falla el primero
        try {
          await conn.sendMessage(m.chat, { text: '⚠️ Se ha detectado un cambio en el grupo' }, { quoted: fkontak });
        } catch (e) {
          console.error(chalk.red('Error al enviar mensaje de respaldo:'), e);
        }
      }
    };

    switch (m.messageStubType) {
      case 21:
        await sendMessageWithRetry({ text: nombre, mentions: [m.sender] }, { quoted: fkontak });
        break;
      case 22:
        await sendMessageWithRetry({ image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak });
        break;
      case 23:
        await sendMessageWithRetry({ text: newlink, mentions: [m.sender] }, { quoted: fkontak });
        break;
      case 25:
        await sendMessageWithRetry({ text: edit, mentions: [m.sender] }, { quoted: fkontak });
        break;
      case 26:
        await sendMessageWithRetry({ text: status, mentions: [m.sender] }, { quoted: fkontak });
        break;
      case 29:
        await sendMessageWithRetry({ text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak });
        break;
      case 30:
        await sendMessageWithRetry({ text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak });
        break;
      default:
        // Para depuración
        console.log({
          messageStubType: m.messageStubType,
          messageStubParameters: m.messageStubParameters,
          type: WAMessageStubType[m.messageStubType],
        });
    }
  } catch (error) {
    console.error(chalk.red('Error en el handler de autodetección:'), error);
  }
}

export default handler;
