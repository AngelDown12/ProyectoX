import fs from 'fs'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // Imagen predeterminada local
  const FOTO_PREDETERMINADA = './src/sinfoto2.jpg'
  // Sticker despedida
  const STICKER_URL = ['https://files.catbox.moe/g3hyc2.webp','https://files.catbox.moe/o58tbw.webp']

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

  let usuario = `@${m.sender.split`@`[0]}`
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))

  let subject = groupMetadata.subject
  let descs = groupMetadata.desc || "Sin descripción"
  let userName = `${m.messageStubParameters[0].split`@`[0]}`

  // Detectamos eventos
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    // Evento de bienvenida (27)
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

  else if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32) && this.user.jid != global.conn.user.jid) {
    // Evento de despedida (28 expulsado o 32 se salió)
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟*👤 @${userName}* 
*╚══════════════*`

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye

    // Enviar mensaje de despedida
    await this.sendMessage(m.chat, { 
      image: img,
      caption: textBye,
      contextInfo: {
        mentionedJid: [m.sender, m.messageStubParameters[0]]
      }
    }, { quoted: m })

    // Además, enviar el sticker de despedida (después de 2 segundos)
    setTimeout(async () => {
      try {
        let sticker = await (await fetch(STICKER_URL)).buffer()
        await conn.sendMessage(m.chat, { sticker: sticker })
      } catch (e) {
        console.error('Error enviando sticker de despedida:', e)
      }
    }, 2000)
  }
}

export default handler
