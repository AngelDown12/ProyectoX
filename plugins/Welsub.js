import fs from 'fs'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // Definir variables esenciales al inicio
  let chat = global.db.data.chats[m.chat]
  if (!chat) return
  
  const FOTO_PREDETERMINADA = './src/comprar.jpg'
  const STICKER_DESPEDIDA = 'https://files.catbox.moe/g3hyc2.webp'
  let userName = m.messageStubParameters[0]?.split('@')[0] || 'Usuario'

  // BIENVENIDAS (sin cambios)
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    // ... (mantén todo el código de bienvenidas igual)
  }

  // DESPEDIDAS (versión mejorada)
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject || 'Este grupo'
    let defaultBye = `*╔══════════════*\n*╟* *SE FUE UNA BASURA*\n*╟*👤 @${userName}*\n*╚══════════════*`
    
    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye

    // 1. Enviar mensaje con imagen + texto
    try {
      // Intentar con imagen predeterminada
      let img = fs.readFileSync(FOTO_PREDETERMINADA)
      await this.sendMessage(m.chat, {
        image: img,
        caption: textBye,
        contextInfo: {
          mentionedJid: [m.sender, m.messageStubParameters[0]]
        }
      }, { quoted: m })
    } catch (e) {
      // Si falla la imagen, enviar solo texto
      await this.sendMessage(m.chat, {
        text: textBye,
        contextInfo: {
          mentionedJid: [m.sender, m.messageStubParameters[0]]
        }
      }, { quoted: m })
    }

    // 2. Enviar sticker después (con delay de 1 segundo para mejor flujo)
    setTimeout(async () => {
      try {
        await this.sendMessage(m.chat, {
          sticker: { url: STICKER_DESPEDIDA },
          contextInfo: {
            mentionedJid: [m.sender, m.messageStubParameters[0]]
          }
        }, { quoted: m })
      } catch (e) {
        console.error('Error al enviar sticker:', e)
      }
    }, 1000)
  }
}

export default handler
