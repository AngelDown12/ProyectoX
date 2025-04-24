import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const invisible = String.fromCharCode(8206).repeat(850); // mención oculta
    const watermark = 'ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';

    const messageText = (text || '').trim();
    if (!messageText) return;

    const fullMessage = `${invisible}${messageText}\n${watermark}`;

    const buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "MENCIÓN 👤",
          id: "boton_mencion"
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "RECORDATORIO 📝",
          id: "boton_recordatorio"
        })
      }
    ];

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            mentionedJid: users
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: { text: fullMessage },
            footer: { text: '' },
            nativeFlowMessage: { buttons }
          })
        }
      }
    }, {});

    await conn.relayMessage(m.chat, msg.message, {});
  } catch (e) {
    console.error(e);
    m.reply('Ocurrió un error al enviar el mensaje.');
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
