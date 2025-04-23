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
    if (!chat || !chat.detect) return;

    // Verificar estado de la conexión
    if (!conn.user || !conn.user.id) {
      console.log(chalk.red('[❌] Conexión no establecida correctamente'));
      return;
    }

    // Verificar si el bot es administrador
    const botAdmin = participants.find(p => p.id === conn.user.id)?.admin;
    if (!botAdmin) {
      console.log(chalk.yellow(`[⚠️] El bot no es admin en el grupo ${m.chat}`));
      return;
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

    // Función mejorada para enviar mensajes
    const sendMessage = async (content, options = {}) => {
      try {
        // Verificar si el chat existe y es accesible
        const chatExists = await conn.groupMetadata(m.chat).catch(() => null);
        if (!chatExists) {
          console.log(chalk.red(`[❌] No se pudo acceder al grupo ${m.chat}`));
          return;
        }

        // Preparar el mensaje
        const messageOptions = {
          ...options,
          quoted: {
            key: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.id,
              participant: m.sender
            },
            message: {
              conversation: "Mensaje de referencia"
            }
          }
        };

        // Enviar el mensaje
        const result = await conn.sendMessage(m.chat, content, messageOptions);
        
        if (result) {
          console.log(chalk.green(`[✅] Mensaje enviado exitosamente al grupo ${m.chat}`));
          return true;
        } else {
          console.log(chalk.yellow(`[⚠️] No se recibió confirmación del envío en ${m.chat}`));
          return false;
        }
      } catch (error) {
        console.error(chalk.red(`[❌] Error al enviar mensaje a ${m.chat}:`), error);
        return false;
      }
    };

    // Log del evento detectado
    console.log(chalk.cyan(`[🔍] Evento detectado en grupo ${m.chat}:`), {
      type: WAMessageStubType[m.messageStubType],
      parameters: m.messageStubParameters,
      usuario: usuario,
      botAdmin: botAdmin,
      chatExists: !!chat
    });

    let messageSent = false;
    switch (m.messageStubType) {
      case 21:
        messageSent = await sendMessage({ text: nombre, mentions: [m.sender] });
        break;
      case 22:
        messageSent = await sendMessage({ image: { url: pp }, caption: foto, mentions: [m.sender] });
        break;
      case 23:
        messageSent = await sendMessage({ text: newlink, mentions: [m.sender] });
        break;
      case 25:
        messageSent = await sendMessage({ text: edit, mentions: [m.sender] });
        break;
      case 26:
        messageSent = await sendMessage({ text: status, mentions: [m.sender] });
        break;
      case 29:
        messageSent = await sendMessage({ text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] });
        break;
      case 30:
        messageSent = await sendMessage({ text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] });
        break;
      default:
        console.log(chalk.gray(`[ℹ️] Evento no manejado en grupo ${m.chat}:`), {
          messageStubType: m.messageStubType,
          messageStubParameters: m.messageStubParameters,
          type: WAMessageStubType[m.messageStubType],
        });
    }

    // Si el mensaje no se envió, intentar con un mensaje simplificado
    if (!messageSent) {
      console.log(chalk.yellow(`[⚠️] Intentando enviar mensaje simplificado a ${m.chat}`));
      await sendMessage({
        text: `⚠️ Se ha detectado un cambio en el grupo\nUsuario: ${usuario}\nTipo: ${WAMessageStubType[m.messageStubType] || 'Desconocido'}`
      });
    }

  } catch (error) {
    console.error(chalk.red('[❌] Error en el handler de autodetección:'), error);
  }
}

export default handler;
