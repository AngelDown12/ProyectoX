const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = 'ㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const messageContent = text ? `${text}\n${watermark}` : watermark;

    // Método COMPROBADO para enviar mensaje + botones
    await conn.sendMessage(m.chat, {
      text: messageContent,
      mentions: users,
      footer: 'Elija una opción:',
      buttons: [
        {
          buttonId: 'mencion_btn',
          buttonText: { displayText: '👤 Mención' },
          type: 1
        },
        {
          buttonId: 'recordatorio_btn',
          buttonText: { displayText: '📝 Recordatorio' },
          type: 1
        }
      ],
      headerType: 1
    }, {
      quoted: m,
      ephemeralExpiration: 86400
    });

    // Confirmación visual opcional
    await conn.sendReaction(m.chat, m.key, '✅');

  } catch (error) {
    console.error('Error al notificar:', error);
    
    // Plan B: Envío segmentado garantizado
    const sentMsg = await conn.sendMessage(m.chat, {
      text: messageContent,
      mentions: users
    }, { quoted: m });
    
    await conn.sendMessage(m.chat, {
      text: 'Opciones disponibles:',
      footer: 'Responda con el número:',
      templateButtons: [
        {
          index: 1,
          quickReplyButton: {
            displayText: '1. 👤 Mención',
            id: 'option1'
          }
        },
        {
          index: 2,
          quickReplyButton: {
            displayText: '2. 📝 Recordatorio',
            id: 'option2'
          }
        }
      ]
    }, { quoted: sentMsg });
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
