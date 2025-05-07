let handler = async (m, { conn, args }) => {
  let opcion = (args[0] || '').toLowerCase();

  let isClose = {
    'abrir': 'not_announcement',
    'abrirgrupo': 'not_announcement',
    'grupoabrir': 'not_announcement',
    'cerrar': 'announcement',
    'cerrargrupo': 'announcement',
    'grupocerrar': 'announcement'
  }[opcion];

  if (!isClose) return;

  // Realizamos el cambio de configuración en el grupo
  await conn.groupSettingUpdate(m.chat, isClose);

  // Opcionalmente puedes enviar un pequeño mensaje confirmando la acción
  if (isClose === 'not_announcement') {
    await m.reply('El grupo está ahora abierto para todos.');
  } else {
    await m.reply('El grupo está ahora cerrado solo para administradores.');
  }
};

handler.help = ['grupo abrir', 'grupo cerrar'];
handler.tags = ['grupo'];
handler.command = /^(grupo|abrirgrupo|cerrargrupo|grupoabrir|grupocerrar)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.exp = 200;

export default handler;
