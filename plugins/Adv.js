const handler = async (m, { conn, text, command, usedPrefix }) => {
  // Asegura que db.data.users esté inicializado
  global.db.data ||= {};  // Si no está definido, inicializa db.data como objeto vacío
  global.db.data.users ||= {};  // Si no está definido, inicializa db.data.users como objeto vacío

  // Recoge la persona mencionada o la respuesta a un mensaje
  let who;
  if (m.isGroup) { 
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text; 
  } else {
    who = m.chat;
  }

  if (!who) return m.reply('Por favor, menciona o responde a un mensaje de un usuario para darle una advertencia.');

  const user = global.db.data.users[who] || { warn: 0 };  // Inicializa el usuario con 0 advertencias si no existe
  const msgtext = text || 'Sin motivo';
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');

  // Si el usuario no es el bot ni un propietario
  if (who === conn.user.jid) {
    return m.reply('No puedo advertir al bot.');
  }

  // Aumenta las advertencias
  user.warn += 1;

  // Muestra el mensaje de advertencia
  await m.reply(
    `${user.warn == 1 ? `*@${who.split`@`[0]}*` : `*@${who.split`@`[0]}*`} Recibió una advertencia en este grupo!.\nMotivo: ${sdms}\n*Advertencias: ${user.warn}/3*`, 
    null, 
    { mentions: [who] }
  );

  // Si el usuario tiene 3 advertencias, lo expulsa
  if (user.warn >= 3) {
    user.warn = 0;
    await m.reply(
      `Te lo advertí varias veces!!!.\n*@${who.split`@`[0]}* Superaste las *3* advertencias, ahora serás eliminado/a.`, 
      null, 
      { mentions: [who] }
    );
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }

  return true;
};

handler.command = ['adv', 'advertir', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
