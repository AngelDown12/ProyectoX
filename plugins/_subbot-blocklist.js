// 📂 plugins/_subbot-envia-bloqueo.js

const numeroPrincipal = '593986304370@s.whatsapp.net'; // JID del bot principal

export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};
  if (!bot.antiPrivate) return !0;
  if (isOwner || isROwner) return !0;

  // Bloquea al usuario
  await conn.updateBlockStatus(m.chat, 'block');

  const numero = m.sender.split('@')[0];
  const nombre = conn.getName ? await conn.getName(m.sender) : 'Usuario';
  const mensajeTexto = m.text || '(Mensaje no disponible)';

  const now = new Date();
  const fecha = now.toLocaleDateString('es-EC', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const hora = now.toLocaleTimeString('es-EC', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const textoAviso = `*USUARIO BLOQUEADO* 📵\n\n` +
                     `👤 Nombre: ${nombre}\n` +
                     `📱 Número: wa.me/${numero}\n` +
                     `📆 Fecha: ${fecha}\n` +
                     `⏰ Hora: ${hora}\n\n` +
                     `📩 Mensaje:\n${mensajeTexto}`;

  // Imprimir solo en consola
  console.log(textoAviso);

  // Mandar mensaje oculto al bot principal (con tag especial para que solo el principal lo lea)
  await conn.sendMessage(numeroPrincipal, { text: `#subbotreporta\n${textoAviso}` });

  return !1;
}
