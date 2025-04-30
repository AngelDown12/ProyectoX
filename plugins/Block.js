// BLOQUEA EN EL NÚMERO PRINCIPAL. EN LOS SUBBOTS DEJA DE RESPONDER.
const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Reemplaza con el número real del bot principal

const handler = async (m, { conn, isOwner }) => {
  if (conn.user.jid !== BOT_PRINCIPAL) return; // Solo ejecuta si es el bot principal
  if (!m.isGroup && !isOwner) {
    const userMention = '@' + m.sender.split('@')[0];
    const fecha = new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await m.reply(
      `Hola ${userMention}\n\nEstá prohibido escribirme al privado, por ende serás bloqueado.\n\nFuiste bloqueado\n(${fecha})`,
      null,
      { mentions: [m.sender] }
    );

    await conn.updateBlockStatus(m.sender, 'block'); // Esta línea es la función original
  }
};

handler.customPrefix = /.*/;
handler.command = new RegExp; // la dejamos si es parte de la estructura del bot
handler.private = true;
handler.owner = false;

export default handler;
