import fs from 'fs'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // Foto predeterminada en ruta local
  const FOTO_PREDETERMINADA = './src/comprar.jpg'
  const STICKER_URL = 'https://files.catbox.moe/g3hyc2.webp' // URL del sticker

  let pp
  try {
    // Intentar obtener la foto de perfil del usuario
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => null)
  } catch {
    pp = null
  }

  let img
  if (pp) {
    try {
      img = await (await fetch(pp)).buffer()  // Intentamos obtener la imagen de perfil del usuario
    } catch {
      img = null
    }
  }

  if (!img) {
    // Si no hay imagen externa, usa la imagen local
    try {
      img = fs.readFileSync(FOTO_PREDETERMINADA)  // Leemos la imagen local
    } catch {
      img = null // Si tampoco existe la imagen local
    }
  }

  let usuario = `@${m.sender.split`@`[0]}`
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))

  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let descs = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟"
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultWelcome = `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜Ó𝗡 

${descs}

*╟* ¡🇼‌🇪‌🇱‌🇨‌🇴‌🇲‌🇪!
*╚══════════════*`

    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject) 
      .replace(/@desc/g, descs)
      : defaultWelcome

    // Enviar el texto con la imagen en un solo mensaje
    await conn.sendMessage(m.chat, { 
      text: textWel, 
      image: img, // Usamos la imagen (local o externa) aquí
      caption: '¡Bienvenido!'  // Leyenda adicional, si lo deseas
    })
  }

  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟*👤 @${userName}* 
*╚══════════════*`

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye

    // Enviar el texto con la imagen en un solo mensaje
    await conn.sendMessage(m.chat, { 
      text: textBye, 
      image: img,  // Usamos la imagen (local o externa) aquí
      caption: '¡Adiós!'  // Leyenda adicional, si lo deseas
    })

    // Enviar sticker después del texto y la imagen
    let sticker = await (await fetch(STICKER_URL)).buffer()  // Obtener el sticker desde la URL
    await conn.sendMessage(m.chat, { 
      sticker: sticker  // Enviar el sticker
    })
  }
}

export default handler
