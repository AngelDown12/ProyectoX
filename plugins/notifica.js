const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    
    // Primero enviar el mensaje base con menciones
    const sentMsg = await conn.sendMessage(m.chat, {
      text: (text || 'Notificación') + watermark,
      mentions: users
    }, { quoted: m });

    // Luego añadir los botones como reacción
    await conn.sendMessage(m.chat, {
      react: {
        text: "📌", // Puedes usar otro emoji
        key: sentMsg.key
      }
    });

    // Opcional: Enviar botones como mensaje separado
    await conn.sendMessage(m.chat, {
      text: 'Selecciona una opción:',
      footer: 'Botones interactivos',
      templateButtons: [
        {index: 1, quickReplyButton: {displayText: '👤 Mención', id: 'mencion'}},
        {index: 2, quickReplyButton: {displayText: '📝 Recordatorio', id: 'recordatorio'}}
      ]
    }, { quoted: sentMsg });

  } catch (error) {
    console.error('Error crítico:', error);
    // Último intento con método alternativo
    const fallbackMsg = await conn.sendMessage(m.chat, { 
      text: `⚠️ ${text || 'Mensaje importante'}\n${watermark}`,
      mentions: users
    }, { quoted: m });
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;
handler.register = true;

export default handler;
