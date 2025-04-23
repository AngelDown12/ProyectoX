import chalk from 'chalk';
let WAMessageStubType = (await import("@whiskeysockets/baileys")).default;
import './_content.js';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  try {
    if (!m.messageStubType || !m.isGroup) return;

    let usuario = `@${m.sender.split`@`[0]}`;
    let chat = global.db.data.chats[m.chat];
    const groupAdmins = participants.filter(p => p.admin);

    // Verificación básica
    if (!chat || !chat.detect || !isBotAdmin) return;

    // Función básica para enviar mensajes
    const sendMessage = async (text, mentions = []) => {
      try {
        await m.reply(text, m.chat, { 
          mentions,
          quoted: m
        });
      } catch (error) {
        console.error(chalk.red(`[❌] Error al enviar mensaje:`), error);
        // Intento alternativo de envío
        try {
          await conn.reply(m.chat, text, m, { 
            mentions
          });
        } catch (e) {
          console.error(chalk.red(`[❌] Error en segundo intento:`), e);
        }
      }
    };

    // Mapeo de tipos de mensaje a funciones
    const messageHandlers = {
      21: () => sendMessage(
        lenguajeGB['smsAvisoAG']() + mid.smsAutodetec1(usuario, m),
        [m.sender, ...groupAdmins.map(v => v.id)]
      ),
      22: () => sendMessage(
        lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec2(usuario, groupMetadata),
        [m.sender]
      ),
      23: () => sendMessage(
        lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec5(groupMetadata, usuario),
        [m.sender]
      ),
      24: () => sendMessage(
        lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec3(usuario, m),
        [m.sender]
      ),
      25: () => sendMessage(
        lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec4(usuario, m, groupMetadata),
        [m.sender]
      ),
      26: () => sendMessage(
        mid.smsAutodetec6(m, usuario, groupMetadata),
        [m.sender]
      ),
      29: () => sendMessage(
        mid.smsAutodetec7(m, usuario),
        [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
      ),
      30: () => sendMessage(
        mid.smsAutodetec8(m, usuario),
        [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
      ),
      72: () => sendMessage(
        lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec9(usuario, m),
        [m.sender]
      ),
      123: () => sendMessage(
        lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec10(usuario, m),
        [m.sender]
      ),
      172: async () => {
        if (m.messageStubParameters.length > 0) {
          const rawUser = m.messageStubParameters[0];
          const users = rawUser.split('@')[0];
          const prefijosProhibidos = ['91', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '212'];
          const usersConPrefijo = users.startsWith('+') ? users : `+${users}`;

          try {
            if (chat.antifake && isBotAdmin && prefijosProhibidos.some(prefijo => usersConPrefijo.startsWith(prefijo))) {
              await conn.groupRequestParticipantsUpdate(m.chat, [rawUser], 'reject');
            } else {
              await conn.groupRequestParticipantsUpdate(m.chat, [rawUser], 'approve');
            }
          } catch (error) {
            console.error(`Error al procesar solicitud:`, error);
          }
        }
      }
    };

    // Ejecutar el manejador correspondiente
    const handler = messageHandlers[m.messageStubType];
    if (handler) {
      await handler();
    }
  } catch (error) {
    console.error(chalk.red('[❌] Error en el handler:'), error);
  }
}

export default handler;
