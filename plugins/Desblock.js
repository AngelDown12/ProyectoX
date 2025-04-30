let handler = async (m, { conn, isROwner }) => {
  if (!isROwner) return m.reply('Este comando solo puede usarlo el dueño principal.');

  if (typeof conn.fetchBlocklist !== 'function') {
    return m.reply('Tu cliente no soporta `fetchBlocklist()`.');
  }

  try {
    let bloqueados = await conn.fetchBlocklist();

    if (!Array.isArray(bloqueados) || bloqueados.length === 0) {
      return m.reply('No hay usuarios bloqueados actualmente.');
    }

    let desbloqueados = 0;

    for (let jid of bloqueados) {
      if (!jid.endsWith('@s.whatsapp.net')) continue;

      try {
        await conn.updateBlockStatus(jid, 'unblock');
        desbloqueados++;
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        console.log(`No se pudo desbloquear a ${jid}:`, e.message);
      }
    }

    m.reply(`Se desbloquearon correctamente ${desbloqueados} usuario(s).`);
  } catch (err) {
    console.error('Error general:', err);
    m.reply('Ocurrió un error al intentar desbloquear usuarios.');
  }
};

handler.command = /^\.?desblock$/i;
handler.rowner = true;
handler.tags = ['owner'];
handler.help = ['desblock'];

export default handler;
