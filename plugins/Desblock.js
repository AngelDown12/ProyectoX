// Archivo: plugins/desbloquear-todos.js

let handler = async (m, { conn, isROwner }) => {
  if (!isROwner) return m.reply('Solo el dueño principal puede usar este comando.');

  if (typeof conn.fetchBlocklist !== 'function') {
    return m.reply('Tu versión de bot no soporta fetchBlocklist.');
  }

  try {
    let bloqueados = await conn.fetchBlocklist();

    if (!bloqueados || bloqueados.length === 0) {
      return m.reply('No hay usuarios bloqueados.');
    }

    for (let jid of bloqueados) {
      await conn.updateBlockStatus(jid, 'unblock');
      await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa
    }

    m.reply(`Desbloqueo completo: ${bloqueados.length} usuario(s) desbloqueado(s).`);
  } catch (err) {
    console.error('Error al desbloquear:', err);
    m.reply('Ocurrió un error durante el desbloqueo.');
  }
};

handler.command = /^\.?desblock$/i;
handler.rowner = true; // Solo root
handler.tags = ['owner'];
handler.help = ['desblock'];

export default handler;
