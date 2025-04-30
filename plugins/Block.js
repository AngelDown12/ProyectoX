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

const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Cambia esto por el JID real

const handler = async (m, { conn, isOwner }) => {
  // Solo ejecutar este plugin si es el bot principal
  if (conn.user.jid !== BOT_PRINCIPAL) return !1; // ¡Devuelve falso para no bloquear otros plugins!

  if (!m.isGroup && !isOwner) {
    await m.reply('No estoy disponible para chats privados. Serás bloqueado.');
    await conn.updateBlockStatus(m.sender, 'block');
  }
};

handler.customPrefix = /.*/;
handler.command = new RegExp;
handler.private = true;
handler.owner = false;
handler.register = false; // Asegura que sea reconocido
handler.fail = null; // Evita errores de fallback

export default handler;
