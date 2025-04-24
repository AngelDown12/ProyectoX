import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = 'ㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const messageText = text ? `${text}\n${watermark}` : watermark;

    // Crear mensaje con estructura compatible
    const msg = {
      text: messageText,
      mentions: users,
      footer: 'Selecciona una opción:',
      buttons: [
        {
          buttonId: 'opcion1',
          buttonText: { displayText: '👤 Mención' },
          type: 1
        },
        {
          buttonId: 'opcion2',
          buttonText: { displayText: '📝 Recordatorio' },
          type: 1
        }
      ],
      headerType: 1
    };

    // Enviar usando el método más confiable
    await conn.sendMessage(m.chat, msg, {
      quoted: m,
      ephemeralExpiration: 24 * 60 * 60, // 24 horas
      mentions: users
    });

  } catch (error) {
    console.error('Error en notifica:', error);
    // Fallback a mensaje simple si falla el interactivo
    await conn.sendMessage(m.chat, { 
      text: `${text || ''}\n${watermark}`,
      mentions: users
    }, { quoted: m });
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
