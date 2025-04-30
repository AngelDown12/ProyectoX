// 📂 plugins/_subbot-envia-bloqueo.js

const numeroPrincipal = '593986304370@s.whatsapp.net'; // JID del bot principal
const GRUPO_NOTIFICACION = '120363355566757025@g.us'; // ID del grupo original

export async function before(m, { conn }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;

  const bot = global.db.data.settings[this.user.jid] || {};
  if (!bot.antiPrivate) return !0; // Solo si antiPrivate está activo

  // Comprobamos si el usuario ya fue bloqueado
  let blocklist = await conn.fetchBlocklist();
  if (!blocklist.includes(m.sender)) return !0; // Solo si ya está bloqueado

  const numero = m.sender.split('@')[0];
  const nombre = conn.getName ? await conn.getName(m.sender) : 'Usuario';
  const mensajeTexto = m.text || '(Mensaje no disponible)';

  const now = new Date();
  const fecha = now.toLocaleDateString('es-EC', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const hora = now.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const textoAviso = `[SUBBOT-BLOCK]\n` +
                     `👤 *Nombre:* ${nombre}\n` +
                     `📱 *Número:* wa.me/${numero}\n` +
                     `📆 *Fecha:* ${fecha}\n` +
                     `🕰️ *Hora:* ${hora}\n\n` +
                     `📩 *Mensaje:*\n${mensajeTexto}`;

  await conn.sendMessage(numeroPrincipal, { text: textoAviso });
  
  return !0;
}
