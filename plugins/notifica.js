import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id));
  const invisible = String.fromCharCode(8206).repeat(850);
  const watermark = 'ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
  const messageText = (text || '').trim();

  if (!messageText) return;

  // 1. Enviar la notificación con mención oculta
  const notifyMsg = generateWAMessageFromContent(m.chat, {
    extendedTextMessage: {
      text: `${invisible}${messageText}\n${watermark}`,
      contextInfo: {
        mentionedJid: users,
        externalAdReply: {
          title: '',
          body: '',
          thumbnailUrl: '',
          sourceUrl: ''
        }
      }
    }
  }, {});

  await conn.relayMessage(m.chat, notifyMsg.message, {});

  // 2. Enviar los botones aparte (sin mención)
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

  const buttonsMsg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: "Selecciona una opción:" },
          footer: { text: "Opciones rápidas" },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, buttonsMsg.message, {});
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
