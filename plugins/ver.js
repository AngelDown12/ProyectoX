let handler = m => m

// Función para manejar el comando .setwel
handler.command = /^setwel$/i
handler.admin = true // Solo admins pueden usarlo
handler.group = true // Solo en grupos
handler.before = async function (m, { conn, text, isAdmin, isOwner }) {
  if (!m.quoted || !text) return m.reply('✳️ *Uso correcto:*\n.setwel [texto] [link de imagen]\n\nEjemplo:\n.setwel ¡Bienvenido @user al grupo @group! https://ejemplo.com/foto.jpg')
  
  let [welcomeText, imageUrl] = text.split(' ')
  if (!welcomeText) return m.reply('🔹 *Debes incluir un mensaje de bienvenida.*')
  
  // Guardar en la base de datos
  let chat = global.db.data.chats[m.chat]
  chat.sWelcome = welcomeText
  chat.welcomeImage = imageUrl || chat.welcomeImage || 'https://qu.ax/Lmiiu.jpg' // Si no hay imagen, usa la predeterminada
  
  m.reply('✅ *Mensaje de bienvenida actualizado correctamente.*')
}

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // Usar imagen personalizada o predeterminada
  let chat = global.db.data.chats[m.chat]
  const FOTO_PREDETERMINADA = chat.welcomeImage || 'https://qu.ax/Lmiiu.jpg'
  
  let pp
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA)
  } catch {
    pp = FOTO_PREDETERMINADA
  }
  
  let img = await (await fetch(pp)).buffer().catch(_ => null)
  let usuario = `@${m.sender.split`@`[0]}`
  let users = participants.map(u => conn.decodeJid(u.id))
  
  // Mensaje de BIENVENIDA (messageStubType: 27)
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let descs = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟"
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultWelcome = `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢́𝗡 

${descs}

*╟* ¡🇼‌🇪‌🇱‌🇨‌🇴‌🇲‌🇪!
*╚══════════════*`

    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject) 
      .replace(/@desc/g, descs)
      : defaultWelcome
      
    await this.sendMessage(m.chat, { 
      text: textWel, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp, 
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: fkontak })
  }
  
  // Mensaje de DESPEDIDA (messageStubType: 28)
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟👤 @${userName}* 
*╚══════════════* `

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye
    
    await this.sendMessage(m.chat, { 
      text: textBye, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp, 
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃 ',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: fkontak })
  }
}

export default handler
