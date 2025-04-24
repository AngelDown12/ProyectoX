import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const invisible = String.fromCharCode(8206).repeat(850);
    const watermark = 'ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const messageText = (text || '').trim();
    if (!messageText) return;

    const fullMessage = `${invisible}${messageText}\n${watermark}`;

    const msg = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: fullMessage,
        contextInfo: {
          mentionedJid: users, // Menciones aquí
          externalAdReply: {
            thumbnail: 'https://telegra.ph/file/03d1e7fc24e1a72c60714.jpg',
            sourceUrl: 'https://example.com'
          }
        }
      }
    }, {});

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
