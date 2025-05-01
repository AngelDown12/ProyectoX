// 📂 plugins/_subbot-reporta-bloqueo.js

export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};
  if (!bot.antiPrivate) return !0;
  if (isOwner || isROwner) return !0;

  await conn.updateBlockStatus(m.chat, 'block');

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

  // SOLO imprimir en consola, NO mandar por privado
  console.log('\n========= BLOQUEO DETECTADO =========\n');
  console.log(textoAviso);
  console.log('\n=====================================\n');

  return !1;
}
