const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const fullMessage = (text || 'Notificación') + watermark;

    // 1. Primero enviar el mensaje base
    const baseMsg = await conn.sendMessage(m.chat, {
      text: fullMessage,
      mentions: users
    }, { quoted: m });

    // 2. Enviar los botones como mensaje interactivo
    await conn.sendMessage(m.chat, {
      templateButtons: [
        {
          index: 1,
          quickReplyButton: {
            displayText: '👤 Mención',
            id: 'mencion_btn'
          }
        },
        {
          index: 2,
          quickReplyButton: {
            displayText: '📝 Recordatorio',
            id: 'recordatorio_btn'
          }
        }
      ],
      text: 'Selecciona una opción:',
      footer: 'Botones interactivos',
      mentions: users,
      viewOnce: true
    }, { quoted: baseMsg });

    // 3. Opcional: Añadir reacción de confirmación
    await conn.sendMessage(m.chat, {
      react: {
        text: "✅",
        key: baseMsg.key
      }
    });

  } catch (error) {
    console.error('Error al enviar botones:', error);
    
    // Fallback: Enviar mensaje simple con opciones en texto
    await conn.sendMessage(m.chat, {
      text: `${fullMessage}\n\n*Opciones:*\n1. 👤 Mención\n2. 📝 Recordatorio`,
      mentions: users
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
