// BLOQUEA EN EL NÚMERO PRINCIPAL. EN LOS SUBBOTS DEJA DE RESPONDER.
const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // Reemplaza con el número real del bot principal

export async function before(m, { isOwner, isROwner }) {
  if (this.user?.jid !== BOT_PRINCIPAL) return !0; // Solo ejecuta si es el bot principal
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes("PIEDRA") || m.text.includes("PAPEL") || m.text.includes("TIJERA")) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};

  if (bot.antiPrivate && !isOwner && !isROwner) {
    const userMention = '@' + m.sender.split('@')[0];
    const fecha = new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await m.reply(
      `Hola ${userMention}\n\nEstá prohibido escribirme al privado, por ende serás bloqueado.\n\nFuiste bloqueado\n(${fecha})\n\n` +
      `» Si necesitas un bot o tienes algún inconveniente, contáctate con mi creador:\n` +
      `» wa.me/593993370003`,
      false,
      { mentions: [m.sender] }
    );

    await this.updateBlockStatus(m.chat, "block");
  }

  return !1; // Previene que otros handlers actúen
}
