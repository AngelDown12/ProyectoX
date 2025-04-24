import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => u.id);
  const invisible = String.fromCharCode(8206).repeat(850); // Invisible chars

  // Enviar mención oculta primero (esto notifica)
  await conn.sendMessage(m.chat, {
    text: invisible,
    mentions: users
  });

  const mensaje = `${text || 'MENSAJE IMPORTANTE PARA TODOS'}\nᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ`;

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
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: mensaje },
          footer: { text: null },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, { userJid: conn.user.id });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
