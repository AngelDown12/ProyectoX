import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = 'ㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const messageText = text ? `${text}\n${watermark}` : watermark;

    // 1. Estructura EXACTA de botones del segundo código (pero corregida)
    const buttons = [
      {
        quickReplyButton: {
          displayText: "👤 MENCIÓN",
          id: "btn_mencion"
        }
      },
      {
        quickReplyButton: {
          displayText: "📝 RECORDATORIO",
          id: "btn_recordatorio"
        }
      }
    ];

    // 2. Mensaje principal con la estructura que WhatsApp acepta
    const msg = {
      text: messageText,
      mentions: users,
      footer: 'Selecciona una opción:',
      buttons: buttons,
      headerType: 1
    };

    // 3. Envío con método garantizado
    await conn.sendMessage(m.chat, msg, {
      quoted: m,
      ephemeralExpiration: 86400 // 24 horas
    });

    // 4. Confirmación opcional (elimina si no necesitas)
    await conn.sendMessage(m.chat, { 
      react: { 
        text: "✅", 
        key: m.key 
      } 
    });

  } catch (error) {
    console.error('Error al enviar:', error);
    
    // Plan B: Enviar como mensaje simple + botones alternativos
    await conn.sendMessage(m.chat, {
      text: `${messageText}\n\n*Opciones:*\n• Escribe *1* para Mención\n• Escribe *2* para Recordatorio`,
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
