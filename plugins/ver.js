let handler = m => m

// 1. Comando para configurar la bienvenida (SOLO ADMINS)
handler.command = /^setwel$/i
handler.admin = true
handler.group = true
handler.before = async function (m, { conn, args, isAdmin, isOwner }) {
  if (!isAdmin && !isOwner) return m.reply('⚠️ Solo los admins pueden usar este comando.')
  
  let text = args.join(' ') // Une todo el texto después de .setwel
  if (!text) return m.reply('✳️ *Uso correcto:*\n.setwel [texto] [link de imagen opcional]\n\nEjemplo:\n.setwel ¡Hola @user! Bienvenido a @group 🎉\n.setwel ¡Bienvenido! https://example.com/foto.jpg')

  // Separa el texto y el link de la imagen (si existe)
  let [welcomeText, imageUrl] = text.split(/(https?:\/\/[^\s]+)/g)
  if (!welcomeText.trim()) return m.reply('🔹 ¡Debes escribir un mensaje de bienvenida!')

  // Guardar en la base de datos
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {} // Asegurar que exista
  let chat = global.db.data.chats[m.chat]
  chat.sWelcome = welcomeText.trim()
  if (imageUrl) chat.welcomeImage = imageUrl.trim() // Si se proporciona link, lo guarda
  
  m.reply('✅ *Mensaje de bienvenida actualizado correctamente.*\n' + 
          `📝 *Texto:* ${welcomeText}\n` + 
          (imageUrl ? `🖼️ *Imagen:* ${imageUrl}` : '🖼️ *Imagen:* Predeterminada'))
}

// 2. Lógica de bienvenidas automáticas (como antes)
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  let chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return // Si no está activado, no hace nada

  // Usa imagen personalizada o predeterminada
  const FOTO_PREDETERMINADA = chat.welcomeImage || 'https://qu.ax/Lmiiu.jpg'
  let pp
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA)
  } catch {
    pp = FOTO_PREDETERMINADA
  }

  // Mensaje de BIENVENIDA (type 27)
  if (m.messageStubType == 27) {
    let userName = `@${m.messageStubParameters[0].split('@')[0]}`
    let groupName = groupMetadata.subject
    let groupDesc = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟"

    let textWel = chat.sWelcome ? 
      chat.sWelcome
        .replace(/@user/g, userName)
        .replace(/@group/g, groupName)
        .replace(/@desc/g, groupDesc)
      : `╔══════════════\n╟ 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔\n╠══════════════\n╟ 🛡️ *${groupName}*\n╟ 👤 *${userName}*\n╟ ${groupDesc}\n╚══════════════`

    await conn.sendMessage(m.chat, {
      text: textWel,
      mentions: [m.sender, m.messageStubParameters[0]],
      contextInfo: {
        externalAdReply: {
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆� 𝔾𝕃𝕆�𝔸�',
          thumbnailUrl: pp,
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: m })
  }
}

export default handler
