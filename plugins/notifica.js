import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const handler = async (m, { conn, text, participants }) => {
  const users = participants.map((u) => conn.decodeJid(u.id));
  const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
  const mensajeBotones = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          mentionedJid: users
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: {
            text: (text || 'MENSAJE DEL ADMIN') + watermark
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

  await conn.relayMessage(m.chat, mensajeBotones.message, {});
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^(notifica)$/i;
handler.group = true;
handler.admin = true;

export default handler;
