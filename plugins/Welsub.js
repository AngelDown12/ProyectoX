import fs from 'fs'
import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
  // Verificar que sea un sub-bot (ajusta esto según cómo identifiques tus sub-bots)
  const isSubBot = conn.user.jid.includes('sub') || conn.user.name.includes('SUB') // Ejemplo: si el JID o nombre contiene "SUB"
  
  // Si NO es sub-bot, salir sin hacer nada
  if (!isSubBot) return
  
  if (!m.messageStubType || !m.isGroup) return

  const chat = global.db.data.chats[m.chat]
  if (!chat) return

  // Configuración para sub-bots
  const FOTO_SUBBOT = './src/sub-bot-welcome.jpg' // Imagen específica para sub-bots
  const STICKER_DESPEDIDA = 'https://files.catbox.moe/g3hyc2.webp' // Tu sticker

  // Datos del usuario
  const userNumber = m.messageStubParameters[0]?.split('@')[0] || 'Usuario'
  const userMention = `@${userNumber}`
  const groupName = groupMetadata.subject || 'Grupo'

  // ===== BIENVENIDAS =====
  if (chat.welcome && m.messageStubType == 27) {
    const welcomeText = `╔══════════════
╟ 🔰 *BIENVENIDO/A* 
╟ 👤 ${userMention}
╟ 🌟 *Al grupo de ${groupName}*
╚══════════════`

    await this.sendMessage(m.chat, {
      image: fs.readFileSync(FOTO_SUBBOT),
      caption: welcomeText,
      contextInfo: { mentionedJid: [m.messageStubParameters[0]] }
    }, { quoted: m })
  }

  // ===== DESPEDIDAS =====
  else if (chat.welcome && m.messageStubType == 28) {
    const byeText = `╔══════════════
╟ 🚪 *SE FUE DEL GRUPO*
╟ 👤 ${userMention}
╚══════════════`

    // 1. Imagen + texto
    await this.sendMessage(m.chat, {
      image: fs.readFileSync(FOTO_SUBBOT),
      caption: byeText,
      contextInfo: { mentionedJid: [m.messageStubParameters[0]] }
    }, { quoted: m })

    // 2. Sticker después de 1 segundo
    setTimeout(async () => {
      await this.sendMessage(m.chat, {
        sticker: { url: STICKER_DESPEDIDA }
      }, { quoted: m })
    }, 1000)
  }
}

export default handler
