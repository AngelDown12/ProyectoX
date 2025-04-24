import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const invisible = String.fromCharCode(8206).repeat(850);
    const watermark = 'ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const messageText = (text || '').trim();
    
    if (!messageText) {
      return m.reply('Por favor, proporciona un mensaje para notificar.');
    }

    const fullMessage = `${invisible}${messageText}\n${watermark}`;

    // Estructura compatible con WhatsApp
    const msg = {
      text: fullMessage,
      mentions: users,
      footer: 'ㅤ',
      buttons: [
        { buttonId: 'id1', buttonText: { displayText: '👤 MENCIÓN' }, type: 1 },
        { buttonId: 'id2', buttonText: { displayText: '📝 RECORDATORIO' }, type: 1 }
      ],
      headerType: 1
    };

    // Envío alternativo que funciona mejor
    await conn.sendMessage(m.chat, msg);
    
  } catch (e) {
    console.error('Error al notificar:', e);
    m.reply('Ocurrió un error al enviar la notificación. Intenta nuevamente.');
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
