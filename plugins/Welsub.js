import fs from 'fs'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // 1. Configuración inicial
  const chat = global.db.data.chats[m.chat]
  if (!chat) return
  
  // Imágenes/stickers
  const FOTO_BIENVENIDA = './src/comprar.jpg' // Imagen para bienvenidas
  const STICKER_DESPEDIDA = 'https://files.catbox.moe/g3hyc2.webp' // Tu sticker
  
  // Datos del usuario
  const userNumber = m.messageStubParameters[0]?.split('@')[0] || 'Usuario'
  const userMention = `@${userNumber}`
  const groupName = groupMetadata.subject || 'Este grupo'

  // ======================
  // 2. BIENVENIDAS (Tipo 27)
  // ======================
  if (chat.welcome && m.messageStubType == 27) {
    // Texto de bienvenida
    const defaultWelcome = `╔══════════════
╟ 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
╠══════════════
╟ 🛡️ *${groupName}*
╟ 👤 *${userMention}*
╟ 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢́𝗡: ${groupMetadata.desc || '🌟 ¡Bienvenido al grupo!'}
╚══════════════`

    const welcomeText = chat.sWelcome 
      ? chat.sWelcome
          .replace(/@user/g, userMention)
          .replace(/@group/g, groupName)
          .replace(/@desc/g, groupMetadata.desc || '')
      : defaultWelcome

    // Obtener imagen (perfil o predeterminada)
    let welcomeImg
    try {
      const ppUrl = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => null)
      welcomeImg = ppUrl ? await (await fetch(ppUrl)).buffer() : fs.readFileSync(FOTO_BIENVENIDA)
    } catch {
      welcomeImg = fs.readFileSync(FOTO_BIENVENIDA)
    }

    // Enviar bienvenida (imagen + texto)
    await this.sendMessage(m.chat, {
      image: welcomeImg,
      caption: welcomeText,
      contextInfo: { mentionedJid: [m.sender, m.messageStubParameters[0]] }
    }, { quoted: m })
  }

  // ======================
  // 3. DESPEDIDAS (Tipo 28)
  // ======================
  else if (chat.welcome && m.messageStubType == 28) {
    // Texto de despedida
    const defaultBye = `╔══════════════
╟ *SE FUE DEL GRUPO*
╟ 👤 ${userMention}
╚══════════════`

    const byeText = chat.sBye 
      ? chat.sBye
          .replace(/@user/g, userMention)
          .replace(/@group/g, groupName)
      : defaultBye

    // a) Primero envía imagen + texto
    try {
      await this.sendMessage(m.chat, {
        image: fs.readFileSync(FOTO_BIENVENIDA), // Usa la misma imagen que bienvenidas
        caption: byeText,
        contextInfo: { mentionedJid: [m.sender, m.messageStubParameters[0]] }
      }, { quoted: m })
    } catch (e) {
      // Si falla la imagen, envía solo texto
      await this.sendMessage(m.chat, {
        text: byeText,
        contextInfo: { mentionedJid: [m.sender, m.messageStubParameters[0]] }
      }, { quoted: m })
    }

    // b) Luego envía el sticker (con retraso de 1s)
    setTimeout(async () => {
      try {
        await this.sendMessage(m.chat, {
          sticker: { url: STICKER_DESPEDIDA },
          contextInfo: { mentionedJid: [m.sender, m.messageStubParameters[0]] }
        }, { quoted: m })
      } catch (e) {
        console.log('Error al enviar sticker:', e)
      }
    }, 1000)
  }
}

export default handler
