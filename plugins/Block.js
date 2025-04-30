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
const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Cambia esto por el JID real
 // <-- Cambia por el JID real del bot principal

const handler = async (m, { conn, isOwner }) => {
  // Si no es el bot principal, no hacer nada y no interferir
  if (conn.user.jid !== BOT_PRINCIPAL) return;

  // Solo si es privado y no es owner
  if (!m.isGroup && !isOwner) {
    await m.reply('No estoy disponible para chats privados. Serás bloqueado.');
    await conn.updateBlockStatus(m.sender, 'block');
  }
};

// Configuración correcta del handler
handler.customPrefix = /.*/;
handler.command = new RegExp;
handler.private = true;
handler.owner = false;

export default handler;
