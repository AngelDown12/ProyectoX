const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // JID del bot principal

export async function before(m, { isOwner, isROwner, conn }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup || !m.message) return !0;

  const bot = global.db.data.settings[conn.user.jid] || {};
  if (!bot.antiPrivate || isOwner || isROwner) return !1;

  const fecha = new Date().toLocaleString('es-EC', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mensaje = m.text || '(mensaje vacío)';

  // Solo subbots envían esta señal
  if (conn.user.jid !== BOT_PRINCIPAL) {
    await conn.sendMessage(BOT_PRINCIPAL, {
      text: `/notibloqueo ${m.sender}|${conn.user.jid}|${fecha}|${mensaje}`
    });
  }

  await conn.updateBlockStatus(m.chat, 'block');
  return !1;
}
