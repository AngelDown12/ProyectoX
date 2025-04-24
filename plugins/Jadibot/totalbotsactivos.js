let handler = async (m, { conn }) => {
  console.log('[subs] Comando recibido de:', m.sender);
  await conn.sendMessage(m.chat, { react: { text: "🤖", key: m.key }});

  const users = [...new Set([...global.conns.filter((conn) => {
    return conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED
  })])];

  console.log('[subs] Sub-bots activos encontrados:', users.length);

  if (users.length === 0) {
    return conn.sendMessage(m.chat, { text: 'No hay sub-bots activos actualmente.' }, { quoted: m });
  }

  const txto = await Promise.all(users.map(async (v, index) => {
    let uptime = await ajusteTiempo(Date.now() - v.uptime);
    return `*${index + 1}. 💻* @${v.user.jid.replace(/[^0-9]/g, '')}\n*Activo :* ${uptime}`;
  }));

  const message = txto.join('\n\n').trim();
  const totalUsers = users.length;

  const SB = `*ProyectoX // EBG*\n*Conectados: ${totalUsers}*\n\n${message}`;

  await conn.sendPresenceUpdate('composing', m.chat);
  const q = await conn.sendMessage(m.chat, {
    text: SB,
    mentions: conn.parseMention(SB)
  }, {
    quoted: m,
    ephemeralExpiration: 24 * 60 * 100,
    disappearingMessagesInChat: 24 * 60 * 100
  });

  confirm[m.sender] = {
    sender: m.sender,
    q,
    totalUsers,
    time: setTimeout(() => delete confirm[m.sender], 60 * 1000)
  };

  console.log('SubbotsInfo guardado:', confirm[m.sender]);
};

handler.command = /^(subs|sub)$/i;
handler.tags = ['jadibot'];
handler.help = ['subs', 'sub'];
