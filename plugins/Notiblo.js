const GRUPO_BLOQUEOS = '120363360571564799@g.us'; // ID del grupo de notificación

export default async function (conn) {
  conn.ev.on('contacts.update', async () => {});

  conn.ev.on('connection.update', async (update) => {
    // Aquí podrías detectar reconexiones si deseas
  });

  conn.ev.on('blocklist.set', async (blockList) => {
    // Este evento no da datos de quién bloqueó, se ignora
  });

  conn.ev.on('presence.update', async () => {});

  conn.ev.on('messages.update', async () => {});

  conn.ev.on('call', async () => {});

  conn.ev.on('contacts.upsert', async () => {});

  conn.ev.on('message-receipt.update', async () => {});

  conn.ev.on('group-participants.update', async () => {});

  // Escuchar bloqueos en tiempo real
  const originalBlock = conn.updateBlockStatus;
  conn.updateBlockStatus = async function (jid, action) {
    if (action === 'block') {
      const fecha = new Date().toLocaleString('es-EC', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });

      await conn.sendMessage(GRUPO_BLOQUEOS, {
        text:
          `*Usuario Bloqueado*\n\n` +
          `*Número:* wa.me/${jid.split('@')[0]}\n` +
          `*Motivo:* Mensaje privado al bot\n` +
          `*Fecha:* ${fecha}\n` +
          `*Bot que bloqueó:* ${conn.user?.id?.split('@')[0]}`
      });
    }
    return originalBlock.apply(this, arguments);
  };
}
