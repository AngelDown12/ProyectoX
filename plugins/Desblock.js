// Archivo: plugins/desbloquear-todos.js

const comando = /^\.desblock$/i;

export default {
  name: 'desblock',
  tags: ['owner'],
  command: comando,
  rowner: true, // Solo root owner

  async handler(m, { conn }) {
    try {
      let bloqueados = await conn.fetchBlocklist?.();

      if (!bloqueados || bloqueados.length === 0) {
        return m.reply('No hay usuarios bloqueados actualmente.');
      }

      for (let jid of bloqueados) {
        await conn.updateBlockStatus(jid, 'unblock');
        await new Promise(resolve => setTimeout(resolve, 300)); // Pausa para evitar límite de Baileys
      }

      m.reply(`Se han desbloqueado *${bloqueados.length}* usuarios correctamente.`);
    } catch (e) {
      console.error(e);
      m.reply('Ocurrió un error al intentar desbloquear. Asegúrate de tener permisos y que tu conexión esté activa.');
    }
  }
};
