let handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => u.id);
  const invisibleChar = String.fromCharCode(8206);
  const hiddenMention = invisibleChar.repeat(850); // Oculta mención

  const mensaje = `${text || 'MENSAJE IMPORTANTE PARA TODOS'}\n\n${hiddenMention}\nᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ`;

  const buttons = [
    { buttonId: 'notifica_mencion', buttonText: { displayText: 'MENCIÓN 👤' }, type: 1 },
    { buttonId: 'notifica_recordatorio', buttonText: { displayText: 'RECORDATORIO 📝' }, type: 1 }
  ];

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: users,
    buttons,
    footer: null,
    headerType: 1
  }, { quoted: m });
};

handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
