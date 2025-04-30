const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Reemplaza con el número real del bot principal

const handler = async (m, { conn, isOwner }) => {
  if (conn.user.jid !== BOT_PRINCIPAL) return; // Solo ejecuta si es el bot principal
  if (!m.isGroup && !isOwner) {
    await m.reply('No estoy disponible para chats privados. Serás bloqueado.');
    await conn.updateBlockStatus(m.sender, 'block');
  }
};

handler.customPrefix = /.*/;
handler.command = new RegExp;
handler.private = true;
handler.owner = false;

export default handler;

//+593 98 630 4370
