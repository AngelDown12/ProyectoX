import chalk from 'chalk';
let WAMessageStubType = (await import("@whiskeysockets/baileys")).default;
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';
import './_content.js';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  try {
    if (!m.messageStubType || !m.isGroup) return;

    let usuario = `@${m.sender.split`@`[0]}`;
    let chat = global.db.data.chats[m.chat];
    let users = participants.map(u => conn.decodeJid(u.id));
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');

    // Definir fkontak con estructura mejorada
    let fkontak = {
      key: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.id || m.messageStubParameters[0],
        participant: m.sender
      },
      message: {
        conversation: "Mensaje de referencia"
      }
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

    // Función auxiliar para enviar mensajes
    const sendMessageWithRetry = async (content, options = {}) => {
      try {
        // Intentar enviar el mensaje original
        await conn.sendMessage(m.chat, content, { ...options, quoted: fkontak });
        return true;
      } catch (error) {
        console.error(chalk.red(`Error al enviar mensaje en ${m.chat}:`), error);
        try {
          // Si falla, intentar con un mensaje simplificado
          await conn.sendMessage(m.chat, { 
            text: `⚠️ Se ha detectado un cambio en el grupo\nUsuario: ${usuario}\nTipo: ${WAMessageStubType[m.messageStubType] || 'Desconocido'}`
          }, { quoted: fkontak });
          return true;
        } catch (e) {
          console.error(chalk.red('Error al enviar mensaje simplificado:'), e);
          return false;
        }
      }
    };

    if (chat.detect && m.messageStubType == 21) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoAG']() + mid.smsAutodetec1(usuario, m), 
        mentions: [m.sender, ...groupAdmins.map(v => v.id)] 
      });   
    } else if (chat.detect && m.messageStubType == 22) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec2(usuario, groupMetadata), 
        mentions: [m.sender] 
      });  
    } else if (chat.detect && m.messageStubType == 23) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec5(groupMetadata, usuario), 
        mentions: [m.sender] 
      }); 
    } else if (chat.detect && m.messageStubType == 24) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec3(usuario, m), 
        mentions: [m.sender] 
      }); 
    } else if (chat.detect && m.messageStubType == 25) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec4(usuario, m, groupMetadata), 
        mentions: [m.sender] 
      }); 
    } else if (chat.detect && m.messageStubType == 26) {
      await sendMessageWithRetry({ 
        text: mid.smsAutodetec6(m, usuario, groupMetadata), 
        mentions: [m.sender] 
      });
    } else if (chat.detect && m.messageStubType == 29) {
      await sendMessageWithRetry({ 
        text: mid.smsAutodetec7(m, usuario), 
        mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] 
      }); 
    } else if (chat.detect && m.messageStubType == 30) {
      await sendMessageWithRetry({ 
        text: mid.smsAutodetec8(m, usuario), 
        mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] 
      });
    } else if (chat.detect && m.messageStubType == 72) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec9(usuario, m), 
        mentions: [m.sender] 
      });
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
    } 
    if (chat.detect && m.messageStubType == 123) {
      await sendMessageWithRetry({ 
        text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec10(usuario, m), 
        mentions: [m.sender] 
      });
    } else {
      if (m.messageStubType == 2) return;
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
