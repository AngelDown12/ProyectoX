const BOTS_PRINCIPALES = [
  '593986304370@s.whatsapp.net', // Elite Bot (Principal)
  '56963048720@s.whatsapp.net',  // Rouse Bot
  '50251864696@s.whatsapp.net',  // Staff Bot
  '529984088511@s.whatsapp.net'  // Mc Bot
];

export async function before(m, { isOwner, isROwner, conn }) {
  const botNumber = conn?.user?.jid || '';

  // Solo bots principales/subbots ejecutan este código
  if (!BOTS_PRINCIPALES.includes(botNumber)) return;

  if (m.isGroup || m.fromMe || !m.message) return;
  if (isOwner || isROwner) return;

  // Mensajes que se deben permitir (como comandos de juegos)
  if (/PIEDRA|PAPEL|TIJERA/i.test(m.text || '')) return;

  // Enviar video y bloquear
  const userMention = '@' + m.sender.split('@')[0];
  const fecha = new Date().toLocaleDateString('es-EC', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/tpmd88.mp4' }, // Tu video estilo gif
    caption: `Hola ${userMention}\n\nEstá prohibido escribirme al privado, por ende serás bloqueado.\n\n` +
             `Fuiste bloqueado\n(${fecha})\n\n` +
             `» Si necesitas un bot o tienes algún inconveniente, contáctate con mi creador:\n` +
             `» wa.me/593993370003`,
    gifPlayback: true,
    mentions: [m.sender]
  }, { quoted: m });

  // Bloquear directamente al usuario
  await conn.updateBlockStatus(m.chat, 'block');
  return !1;
}
