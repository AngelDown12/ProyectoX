var handler = async (m, {conn, args, usedPrefix, command}) => {
  // Unimos todo el texto después del comando y lo convertimos a minúsculas
  const action = m.text.slice(usedPrefix.length + command.length).trim().toLowerCase();
  
  const isClose = { 
    'open': 'not_announcement',
    'close': 'announcement',
    'abierto': 'not_announcement',
    'cerrado': 'announcement',
    'abrir': 'not_announcement',
    'cerrar': 'announcement',
    'abrir grupo': 'not_announcement',
    'grupo abrir': 'not_announcement',
    'abrirgrupo': 'not_announcement',
    'grupoabrir': 'not_announcement',
    'cerrar grupo': 'announcement',
    'grupo cerrar': 'announcement',
    'cerrargrupo': 'announcement',
    'grupocerrar': 'announcement',
    'desbloquear': 'unlocked',
    'bloquear': 'locked'
  }[action];

  if (isClose === undefined) {
    return conn.reply(m.chat, `*Elija una opción para configurar el grupo*\n\nEjemplos:\n*○ ${usedPrefix}grupoabrir*\n*○ ${usedPrefix}grupo cerrar grupo*\n*○ ${usedPrefix}grupo bloquear*\n*○ ${usedPrefix}grupo desbloquear*`, m);
  }

  await conn.groupSettingUpdate(m.chat, isClose);
  await m.react('✅');
}

handler.help = ['grupo [abrir/cerrar/bloquear/desbloquear]'];
handler.tags = ['grupo'];
handler.command = /^(grupo|group|abrirgrupo|grupoabrir|cerrargrupo|grupocerrar)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;
