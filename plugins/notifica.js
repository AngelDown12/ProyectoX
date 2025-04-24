import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = 'ㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const fullMessage = (text || 'Notificación') + '\n' + watermark;

    // 1. Estructura compatible con WhatsApp (2023)
    const buttonMessage = {
      text: fullMessage,
      footer: 'Selecciona una opción:',
      buttons: [
        { buttonId: 'id1', buttonText: { displayText: '👤 Mención' }, type: 1 },
        { buttonId: 'id2', buttonText: { displayText: '📝 Recordatorio' }, type: 1 }
      ],
      mentions: users,
      headerType: 1
    };

    // 2. Enviar mensaje principal
    const sentMsg = await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

    // 3. Añadir reacción de confirmación (opcional)
    await conn.sendMessage(m.chat, {
      react: {
        text: "✅",
        key: sentMsg.key
      }
    });

  } catch (error) {
    console.error('Error crítico:', error);
    
    // Plan B: Enviar mensaje simple si falla el interactivo
    await conn.sendMessage(m.chat, { 
      text: fullMessage,
      mentions: users
    }, { quoted: m });
    
    // Plan C: Enviar botones como mensaje separado
    await conn.sendMessage(m.chat, {
      text: 'Opciones disponibles:',
      footer: 'Elije una acción',
      templateButtons: [
        {
          index: 1,
          quickReplyButton: { displayText: 'Mención', id: 'mencion' }
        },
        {
          index: 2,
          quickReplyButton: { displayText: 'Recordatorio', id: 'recordatorio' }
        }
      ]
    }, { quoted: m });
  }
};

// Configuración del handler
handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
