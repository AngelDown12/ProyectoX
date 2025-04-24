let handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => u.id);
  const invisibleChar = String.fromCharCode(8206); // \u200E
  const invisibleMention = invisibleChar.repeat(850); // Oculta el contenido expandido

  const message = `🔥 *MENSAJE DEL ADMIN* 🔥

${text || 'MENSAJE IMPORTANTE PARA TODOS'}

${invisibleMention}

ᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ`;

  const buttons = [
    { buttonId: 'notifica_mencion', buttonText: { displayText: 'MENCIÓN 👤' }, type: 1 },
    { buttonId: 'notifica_recordatorio', buttonText: { displayText: 'RECORDATORIO 📝' }, type: 1 }
  ];

  await conn.sendMessage(m.chat, {
    text: message,
    mentions: users,
    buttons: buttons,
    footer: '',
    headerType: 1
  }, { quoted: m });
};

handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
