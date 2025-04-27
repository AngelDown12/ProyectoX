import fs from 'fs'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // Definir chat aquí para que esté disponible en ambos casos
  let chat = global.db.data.chats[m.chat]
  if (!chat) return // Si no existe el chat en la DB, salir

  // Foto predeterminada para BIENVENIDAS (local)
  const FOTO_PREDETERMINADA = './src/comprar.jpg'
  // Sticker para DESPEDIDAS (URL externa)
  const STICKER_DESPEDIDA = 'https://files.catbox.moe/g3hyc2.webp'

  // BIENVENIDAS (messageStubType 27)
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let pp
    try {
      pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => null)
    } catch {
      pp = null
    }

    let img
    if (pp) {
      try {
        img = await (await fetch(pp)).buffer()
      } catch {
        img = null
      }
    }

    if (!img) {
      try {
        img = fs.readFileSync(FOTO_PREDETERMINADA)
      } catch {
        img = null
      }
    }

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
      image: img,
      caption: textWel,
      contextInfo: {
        mentionedJid: [m.sender, m.messageStubParameters[0]]
      }
    }, { quoted: m })
  }

  // DESPEDIDAS (messageStubType 28)
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟*👤 @${userName}* 
*╚══════════════*`

    // Enviar sticker de despedida
    await this.sendMessage(m.chat, { 
      sticker: { url: STICKER_DESPEDIDA },
      contextInfo: {
        mentionedJid: [m.sender, m.messageStubParameters[0]]
      }
    }, { quoted: m })

    // Enviar mensaje de despedida (opcional)
    await this.sendMessage(m.chat, { 
      text: defaultBye,
      contextInfo: {
        mentionedJid: [m.sender, m.messageStubParameters[0]]
      }
    }, { quoted: m })
  }
}

export default handler
