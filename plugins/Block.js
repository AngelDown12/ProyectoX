// BLOQUEA EN EL NÚMERO PRINCIPAL. EN LOS SUBBOTS DEJA DE RESPONDER.
/*
const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Reemplaza con el número real del bot principal

const handler = async (m, { conn, isOwner }) => {
  if (conn.user.jid !== BOT_PRINCIPAL) return; // Solo ejecuta si es el bot principal
  if (!m.isGroup && !isOwner) {
    await m.reply('No estoy disponible para chats privados. Serás bloqueado.');
    await conn.updateBlockStatus(m.sender, 'block');
  }
};

handler.customPrefix = /.*/;
/*handler.command = new RegExp;
handler.private = true;
handler.owner = false;

export default handler;
*/



//BLOQUEA EN EL NÚMERO PRINCIPAL. EN LOS SUBBOTS RESPONDE COMANDOS
const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Tu número

const handler = async function (m, { conn, isOwner }) {
  // Solo actuar si es el bot principal
  if (conn.user.jid !== BOT_PRINCIPAL) return;

  // Si no es grupo ni owner, bloquear
  if (!m.isGroup && !isOwner) {
    await m.reply('No acepto mensajes privados. Serás bloqueado.');
    await conn.updateBlockStatus(m.sender, 'block');
  }
};

handler.all = true;           // Escucha todos los mensajes
handler.command = [];         // No responde a comandos
handler.customPrefix = null;
handler.register = true;
handler.owner = false;
handler.fail = null;

export default handler;
