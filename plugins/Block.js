const BOTS_PRINCIPALES = [
  '593986304370@s.whatsapp.net', // Elite Bot
  '56963048720@s.whatsapp.net',  // Rouse Bot 
  '50251864696@s.whatsapp.net',  // Staff Bot
  '529984088511@s.whatsapp.net'  // Mc Bot
];

export async function before(m, { isOwner, isROwner, conn }) {
  const botJid = conn?.user?.jid || this.user?.jid || '';
  if (!BOTS_PRINCIPALES.includes(botJid)) return !0;

  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes("PIEDRA") || m.text.includes("PAPEL") || m.text.includes("TIJERA")) return !0;

  let bot = global.db.data.settings[botJid] || {};

  if (bot.antiPrivate && !isOwner && !isROwner) {
    const userMention = '@' + m.sender.split('@')[0];
    const fecha = new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await conn.sendMessage(m.chat, {
      video: { url: 'https://files.catbox.moe/tpmd88.mp4' },
      caption: `Hola ${userMention}\n\nEstá prohibido escribirme al privado, por ende serás bloqueado.\n\nFuiste bloqueado\n(${fecha})\n\n` +
               `» Si necesitas un bot o tienes algún inconveniente, contáctate con mi creador:\n` +
               `» wa.me/593993370003`,
      gifPlayback: true,
      mentions: [m.sender]
    }, { quoted: m });

    await conn.updateBlockStatus(m.chat, "block");
  }

  return !1;
}
