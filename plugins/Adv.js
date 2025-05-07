import db from '../lib/database.js';

const handler = async (m, { conn, command }) => {
  // Asegura que db.data y db.data.chats estén inicializados
  db.data ||= {};  // Si db.data no está definido, lo inicializa como un objeto vacío
  db.data.chats ||= {};  // Si db.data.chats no está definido, lo inicializa como un objeto vacío
  db.data.advertencias ||= {};  // Si db.data.advertencias no está definido, lo inicializa como un objeto vacío
  db.data.advertencias[m.chat] ||= {};  // Inicializa las advertencias del grupo en particular
  
  // Recolecta menciones y replies
  const mentions = new Set(m.mentionedJid || []);
  if (m.quoted) mentions.add(m.quoted.sender);

  if (!mentions.size) return m.reply('Menciona o responde a alguien para usar este comando.');

  for (const jid of mentions) {
    if (!jid || typeof jid !== 'string') continue; // Validar JID

    // Inicializa las advertencias del usuario si no existen
    db.data.advertencias[m.chat][jid] ||= 0;

    switch (command) {
      case 'adv': {
        db.data.advertencias[m.chat][jid] += 1;
        const warns = db.data.advertencias[m.chat][jid];

        if (warns >= 3) {
          db.data.advertencias[m.chat][jid] = 0;
          try {
            await m.reply(`@${jid.split`@`[0]} fue expulsado por acumular 3 advertencias.`, null, { mentions: [jid] });
            await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
          } catch (e) {
            await m.reply(`No se pudo expulsar a @${jid.split`@`[0]}. Verifica si soy admin.`, null, { mentions: [jid] });
          }
        } else {
          await m.reply(`Advertencia #${warns} para @${jid.split`@`[0]}.`, null, { mentions: [jid] });
        }
        break;
      }

      case 'quitaradv': {
        const warns = db.data.advertencias[m.chat][jid];
        if (warns <= 0) {
          await m.reply(`@${jid.split`@`[0]} no tiene advertencias.`, null, { mentions: [jid] });
        } else {
          db.data.advertencias[m.chat][jid] -= 1;
          await m.reply(`Se quitó 1 advertencia a @${jid.split`@`[0]}. Ahora tiene ${db.data.advertencias[m.chat][jid]} advertencia(s).`, null, { mentions: [jid] });
        }
        break;
      }
    }
  }

  if (command === 'listaadv') {
    const lista = Object.entries(db.data.advertencias[m.chat])
      .filter(([_, count]) => count > 0)
      .map(([jid, count], i) => `${i + 1}. @${jid.split`@`[0]} → ${count} advertencia(s)`)
      .join('\n');

    m.reply(lista || 'Nadie tiene advertencias.', null, {
      mentions: Object.keys(db.data.advertencias[m.chat])
    });
  }
};

handler.command = ['adv', 'quitaradv', 'listaadv'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
