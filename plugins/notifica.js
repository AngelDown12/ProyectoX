import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const handler = async (m, { conn, text, participants }) => {
  const users = participants.map((u) => conn.decodeJid(u.id)); // Obtener los JIDs de los participantes
  const watermark = 'ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ'; // Watermark que aparece al final

  // El carácter invisible para ocultar las menciones pero sigue funcionando para notificar
  const more = String.fromCharCode(8206); 
  const invisibleMention = more.repeat(850); // Esto ayuda a que las menciones no sean visibles pero se notifiquen

  const mensajeBotones = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          mentionedJid: users // Aquí es donde se activan las menciones, sin mostrar los @id
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: {
            text: `${text || 'MENSAJE DEL ADMIN'}\n${invisibleMention}\n${watermark}`
          },
          footer: { text: 'Selecciona una opción' },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: 'MENCIÓN 👤',
                  id: 'notifica_mencion'
                })
              },
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: 'RECORDATORIO 📝',
                  id: 'notifica_recordatorio'
                })
              }
            ]
          }
        })
      }
    }
  }, {});

  // Relatamos el mensaje a todos los participantes
  await conn.relayMessage(m.chat, mensajeBotones.message, {});
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^(notifica)$/i;
handler.group = true;
handler.admin = true;

export default handler;
