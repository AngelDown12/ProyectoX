import db from '../lib/database.js';

const handler = async (m, { conn, args, text, participants, command }) => {
  const chats = db.data.chats[m.chat] || {};
  db.data.advertencias = db.data.advertencias || {};
  db.data.advertencias[m.chat] = db.data.advertencias[m.chat] || {};

  const mentions = [...m.mentionedJid];
  if (m.quoted) mentions.push(m.quoted.sender); // Soporte para replies

  switch (command) {
    case 'adv':
      if (!mentions.length) return m.reply('Menciona o responde a alguien para advertir.');
      for (const jid of mentions) {
        let warns = db.data.advertencias[m.chat][jid] || 0;
        warns++;
        db.data.advertencias[m.chat][jid] = warns;

        if (warns >= 3) {
          await m.reply(`El usuario @${jid.split`@`[0]} fue expulsado por acumular 3 advertencias.`, null, { mentions: [jid] });
          await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
          db.data.advertencias[m.chat][jid] = 0;
        } else {
          await m.reply(`Advertencia #${warns} para @${jid.split`@`[0]}.`, null, { mentions: [jid] });
        }
      }
      break;

    case 'quitaradv':
      if (!mentions.length) return m.reply('Menciona o responde a alguien para quitar advertencias.');
      for (const jid of mentions) {
        let warns = db.data.advertencias[m.chat][jid] || 0;
        if (warns <= 0) {
          await m.reply(`@${jid.split`@`[0]} no tiene advertencias.`, null, { mentions: [jid] });
        } else {
          warns--;
          db.data.advertencias[m.chat][jid] = warns;
          await m.reply(`Se quitó 1 advertencia a @${jid.split`@`[0]}. Ahora tiene ${warns} advertencia(s).`, null, { mentions: [jid] });
        }
      }
      break;

    case 'listaadv':
      const lista = Object.entries(db.data.advertencias[m.chat])
        .filter(([_, count]) => count > 0)
        .map(([jid, count], i) => `${i + 1}. @${jid.split`@`[0]} → ${count} advertencia(s)`)
        .join('\n');
      m.reply(lista || 'Nadie tiene advertencias.', null, {
        mentions: Object.keys(db.data.advertencias[m.chat])
      });
      break;
  }
};

handler.command = ['adv', 'quitaradv', 'listaadv'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
