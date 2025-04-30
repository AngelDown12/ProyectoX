// 📂 plugins/_subbot-blocklist.js
const groupRegistro = '120363355566757025@g.us'; // ID del grupo de registro

export async function before(m, { conn }) {
  if (!m.isBaileys || !m.text) return;
  if (!m.chat.endsWith('@s.whatsapp.net')) return;

  const prefix = '[SUBBOT-BLOCK]';
  if (!m.text.startsWith(prefix)) return;

  const contenido = m.text.slice(prefix.length).trim();
  if (!contenido) return;

  const mensajeRegistro = `🚫 *Subbot reporta un bloqueo*\n\n${contenido}\n\n📌 *Reportado por:* wa.me/${m.sender.split('@')[0]}`;
  await conn.sendMessage(groupRegistro, { text: mensajeRegistro });
}
