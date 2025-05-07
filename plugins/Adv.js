let handler = async (m, { conn, text, command, usedPrefix }) => {
  const warnLimit = 3;
  const img = 'https://i.imgur.com/DvHoMc3.jpg';
  const chats = global.db.data.chats[m.chat] || {};
  const users = global.db.data.users;
  const isGroup = m.isGroup;

  if (!isGroup) return m.reply('Este comando solo funciona en grupos.');
  if (!chats.antitoxic && command !== 'listaadv') return m.reply(`Debes activar el antitóxicos con *${usedPrefix}on antitoxicos*`);

  let who;
  if (command !== 'listaadv') {
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
    if (!who) return m.reply(`Etiqueta o responde a un usuario.`);
  }

  const user = who ? (users[who] || (users[who] = { warn: 0 })) : null;

  if (command == 'adv') {
    let motivo = text.replace(/@\d+/, '').trim() || 'Sin motivo';
    user.warn += 1;
    await m.reply(
      `*@${who.split`@`[0]}* recibió una advertencia.\n*Motivo:* ${motivo}\n*Advertencias:* ${user.warn}/${warnLimit}`,
      null, { mentions: [who] });

    if (user.warn >= warnLimit) {
      user.warn = 0;
      await m.reply(`*@${who.split`@`[0]}* llegó al límite de advertencias y será eliminado.`, null, { mentions: [who] });
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    }
  }

  if (command == 'quitaradv') {
    if (user.warn > 0) {
      user.warn -= 1;
      await m.reply(`Se quitó 1 advertencia a *@${who.split`@`[0]}*.\nAdvertencias restantes: ${user.warn}/${warnLimit}`, null, { mentions: [who] });
    } else {
      await m.reply(`*@${who.split`@`[0]}* no tiene advertencias.`, null, { mentions: [who] });
    }
  }

  if (command == 'listaadv') {
    let lista = Object.entries(users)
      .filter(([jid, u]) => u.warn > 0)
      .map(([jid, u], i) => `${i + 1}. @${jid.split`@`[0]} → ${u.warn}/${warnLimit}`)
      .join('\n');

    if (!lista) lista = 'Ningún usuario tiene advertencias.';
    await m.reply(`*Lista de usuarios advertidos:*\n\n${lista}`, null, {
      mentions: Object.keys(users).filter(jid => users[jid].warn > 0),
    });
  }
};

handler.command = /^(adv|quitaradv|listaadv)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
