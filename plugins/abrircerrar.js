var handler = async (m, {conn, args, usedPrefix, command}) => {
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
  }[(args.join(' ') || '').toLowerCase()]
  
  if (isClose === undefined) { 
    return conn.reply(m.chat, `*Elija una opción para configurar el grupo*\n\nEjemplo:\n*○ ${usedPrefix}${command} abrir grupo*\n*○ ${usedPrefix}${command} grupo cerrar*\n*○ ${usedPrefix}${command} bloquear*\n*○ ${usedPrefix}${command} desbloquear*`, m) 
  }
  
  await conn.groupSettingUpdate(m.chat, isClose)
  conn.reply(m.chat, '✅ *Configurado correctamente*', m)
  await m.react('✅')
}

handler.help = ['group abrir / cerrar']
handler.tags = ['grupo']
handler.command = /^(group|grupo|abrirgrupo|grupoabrir|cerrargrupo|grupocerrar)$/i
handler.admin = true
handler.botAdmin = true

export default handler
