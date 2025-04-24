let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  // Verificar permisos
  if (!isAdmin && !isOwner) return m.reply('🚫 Solo los administradores pueden usar este comando')
  
  // Obtener texto completo
  let fullText = args.join(' ')
  if (!fullText) return m.reply('✳️ Uso correcto:\n.setwel [texto] [link de imagen opcional]\n\nEjemplo:\n.setwel ¡Bienvenido @user! https://ejemplo.com/foto.jpg')

  // Separar texto e imagen (usando expresión regular mejorada)
  let textMatch = fullText.match(/(.*?)(https?:\/\/[^\s]+)?$/)
  let welcomeText = textMatch[1].trim()
  let imageUrl = textMatch[2] ? textMatch[2].trim() : null

  // Validar texto
  if (!welcomeText) return m.reply('🔷 Debes escribir un mensaje de bienvenida')

  // Guardar en base de datos
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  
  global.db.data.chats[m.chat].sWelcome = welcomeText
  if (imageUrl) global.db.data.chats[m.chat].welcomeImage = imageUrl

  // Respuesta de confirmación
  let response = `✅ *Configuración guardada:*\n`
  response += `📝 Mensaje: ${welcomeText}\n`
  response += imageUrl ? `🖼️ Imagen: ${imageUrl}` : '🖼️ Imagen: Predeterminada'
  
  m.reply(response)
}

handler.help = ['setwel <texto> [imagen]']
handler.tags = ['group']
handler.command = /^setwel$/i
handler.group = true
handler.admin = true

export default handler
