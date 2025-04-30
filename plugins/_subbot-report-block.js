// 📂 plugins/_subbot-report-block.js

const numeroPrincipal = '593986304370@s.whatsapp.net'; // JID del bot principal

export async function after(event, conn) {
  // Este plugin escucha bloqueos (updateBlockStatus)
  if (!event || !event.blocklist) return;

  for (let bloqueado of event.blocklist) {
    if (!bloqueado.id || bloqueado.action !== 'block') continue; // Solo bloqueos

    let numeroBloqueado = bloqueado.id.split('@')[0];
    let fecha = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

    let textoAviso = `[SUBBOT-BLOCK]\n👤 *Usuario bloqueado:* wa.me/${numeroBloqueado}\n📝 *Razón:* Antiprivado\n🕰️ *Fecha:* ${fecha}`;

    await conn.sendMessage(numeroPrincipal, { text: textoAviso });
  }
}
