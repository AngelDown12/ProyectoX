const handler = async (m, { conn, text, command, usedPrefix }) => {
  // Evitar advertir al bot mismo
  if (m.mentionedJid.includes(conn.user.jid)) return;

  const pp = './src/catalogo.jpg';
  let number, ownerNumber, aa, who;
  
  if (m.isGroup) { 
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text; 
  } else {
    who = m.chat;
  }
  
  // Asegurarse de que `global.db.data.users` esté inicializado
  global.db.data ||= {};  // Si no está definido, inicializa db.data como objeto vacío
  global.db.data.users ||= {};  // Si no está definido, inicializa db.data.users como objeto vacío
  
  const user = global.db.data.users[who] || { warn: 0 };  // Si no existe el usuario, inicializa con 0 advertencias
  const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net';
  const bot = global.db.data.settings[conn.user.jid] || {};
  const dReason = 'Sin motivo';
  const msgtext = text || dReason; 
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');
  const warntext = `Etiquete a una persona o responda a un mensaje del grupo para advertir al usuario.`;

  if (!who) {
    return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  // Comprobación si el mensaje es de los propietarios
  for (let i = 0; i < global.owner.length; i++) {
    ownerNumber = global.owner[i][0];
    if (usuario.replace(/@s\.whatsapp\.net$/, '') === ownerNumber) {
      aa = ownerNumber + '@s.whatsapp.net';
      await conn.reply(m.chat, `...`, m, { mentions: [aa] });
      return;
    }
  }

  // Aumentar las advertencias
  user.warn += 1;

  await m.reply(
    `${user.warn == 1 ? `*@${who.split`@`[0]}*` : `*@${who.split`@`[0]}*`} Recibió una advertencia en este grupo!.\nMotivo: ${sdms}\n*Advertencias: ${user.warn}/3*`, 
    null, 
    { mentions: [who] }
  );
  
  // Si el usuario supera las 3 advertencias, se le elimina
  if (user.warn >= 3) {
    user.warn = 0;
    await m.reply(
      `${emoji} Te lo advertí varias veces!!!.\n*@${who.split`@`[0]}* Superaste las *3* advertencias, ahora serás eliminado/a.`, 
      null, 
      { mentions: [who] }
    );
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }

  return !1;
};

handler.command = ['advertir', 'adv', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
