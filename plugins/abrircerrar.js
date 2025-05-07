let handler = async (m, { conn, args }) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg';  
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

  await conn.groupSettingUpdate(m.chat, isClose);

  if (isClose === 'not_announcement') {
    conn.sendButton(m.chat, '', '', pp, [['Menú', '/menu']], m);
  } else {
    conn.sendButton(m.chat, '', '', pp, [['Menú', '/menu']], m);
  }
};

handler.help = ['grupo abrir', 'grupo cerrar'];
handler.tags = ['grupo'];
handler.command = /^(grupo|abrirgrupo|cerrargrupo|grupoabrir|grupocerrar)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.exp = 200;

export default handler;
