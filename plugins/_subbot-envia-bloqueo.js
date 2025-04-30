// 📂 plugins/_subbot-reporta-bloqueo.js

const numeroPrincipal = '593986304370@s.whatsapp.net'; // JID del bot principal

export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};
  if (!bot.antiPrivate) return !0; // Solo si anti privado está activo
  if (isOwner || isROwner) return !0; // No bloquear a dueños

  // Ejecuta el bloqueo
  await conn.updateBlockStatus(m.chat, 'block');

  const userMention = '@' + m.sender.split('@')[0];
  const numero = m.sender.split('@')[0];
  const now = new Date();
  const fecha = now.toLocaleDateString('es-EC', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const hora = now.toLocaleTimeString('es-EC', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const nombre = conn.getName ? await conn.getName(m.sender) : 'Usuario';
  const mensajeTexto = m.text || '(Mensaje no disponible)';

  const textoAviso = `*USUARIO BLOQUEADO* 📵\n\n` +
                     `👤 Nombre: ${nombre}\n` +
                     `📱 Número: wa.me/${numero}\n` +
                     `📆 Fecha: ${fecha}\n` +
                     `⏰ Hora: ${hora}\n\n` +
                     `📩 Mensaje:\n${mensajeTexto}`;

  // Enviar reporte al bot principal
  await conn.sendMessage(numeroPrincipal, { text: textoAviso });

  return !1;
}
