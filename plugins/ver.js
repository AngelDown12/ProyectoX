const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  // Verificar permisos
  if (!isAdmin && !isOwner) {
    return conn.sendMessage(m.chat, { text: '🚫 *Solo admins pueden usar este comando*' }, { quoted: m })
  }

  // Unir todos los argumentos
  const fullText = args.join(' ')
  if (!fullText) {
    return conn.sendMessage(m.chat, { 
      text: '✳️ *Uso correcto:*\n.setwel [texto] [link de imagen opcional]\n\nEjemplo:\n.setwel ¡Bienvenido @user! https://example.com/foto.jpg' 
    }, { quoted: m })
  }

  // Extraer texto e imagen (manera más confiable)
  let welcomeText, imageUrl
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urlMatch = fullText.match(urlRegex)
  
  if (urlMatch) {
    imageUrl = urlMatch[0]
    welcomeText = fullText.replace(urlRegex, '').trim()
  } else {
    welcomeText = fullText.trim()
  }

  // Guardar en la base de datos (estructura segura)
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = { 
    sWelcome: '', 
    welcomeImage: 'https://qu.ax/Lmiiu.jpg' 
  }

  global.db.data.chats[m.chat].sWelcome = welcomeText || '¡Bienvenido @user al grupo!'
  if (imageUrl) global.db.data.chats[m.chat].welcomeImage = imageUrl

  // Enviar confirmación VISIBLE
  const response = `✅ *Configuración actualizada:*\n\n` +
                  `📝 *Mensaje:*\n${welcomeText}\n\n` +
                  `🖼️ *Imagen:* ${imageUrl || 'Predeterminada'}\n\n` +
                  `ℹ️ Ahora cuando alguien entre al grupo verán este mensaje.`
  
  await conn.sendMessage(m.chat, { 
    text: response,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['setwel <texto> [imagen]']
handler.tags = ['group']
handler.command = /^setwel$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
