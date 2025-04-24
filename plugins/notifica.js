import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const invisible = String.fromCharCode(8206).repeat(850); // Mencion oculta
    const watermark = 'ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';

    const messageText = (text || '').trim();
    if (!messageText) return;

    const fullMessage = `${invisible}${messageText}\n${watermark}`;

    // 1. Definir los botones (Quick Replies)
    const buttons = [
      {
        buttonId: "boton_mencion",
        buttonText: { displayText: "👤 MENCIÓN" },
        type: 1 // Quick Reply
      },
      {
        buttonId: "boton_recordatorio",
        buttonText: { displayText: "📝 RECORDATORIO" },
        type: 1 // Quick Reply
      }
    ];

    // 2. Crear el mensaje interactivo CON menciones
    const msg = generateWAMessageFromContent(m.chat, {
      interactiveMessage: {
        body: {
          text: fullMessage,
          contextInfo: {
            mentionedJid: users // ✅ Menciones aquí (funcionarán)
          }
        },
        footer: { text: '' },
        buttons: buttons,
        headerType: 1 // Texto normal
      }
    }, {});

    // 3. Enviar el mensaje
    await conn.relayMessage(m.chat, msg.message, {});
  } catch (e) {
    console.error(e);
    m.reply('Error al enviar el mensaje.');
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
