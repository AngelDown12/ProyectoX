let handler = async function (m, { conn, text, participants, groupMetadata }) {
  // Comando para configurar bienvenida con imagen
  if (m.body.startsWith('.setwel')) {
    let fkontak = {
      key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
      message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Bot\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }
    }

    if (!text || !text.includes('http')) throw `✦ Usa el formato correcto:\n.setwel mensaje https://linkimagen.jpg`

    let parts = text.trim().split(' ')
    let image = parts.pop()
    let msg = parts.join(' ')

    global.db.data.chats[m.chat].sWelcome = msg
    global.db.data.chats[m.chat].sWelcomeImg = image
    global.db.data.chats[m.chat].welcome = true

    conn.reply(m.chat, '✅ Bienvenida y foto personalizada configuradas.', fkontak)
  }

  // Bienvenida y despedida automáticas
  if (!m.messageStubType || !m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.welcome) return
  if (this.user.jid == global.conn.user.jid) return

  let isWelcome = m.messageStubType === 27
  let isBye = m.messageStubType === 28
  if (!isWelcome && !isBye) return

  let userJid = m.messageStubParameters[0]
  let username = userJid.split('@')[0]
  let groupName = groupMetadata.subject
  let groupDesc = groupMetadata.desc || ''
  let image = chat.sWelcomeImg || 'https://qu.ax/Lmiiu.jpg'

  let msg = isWelcome
    ? (chat.sWelcome || '👋 Bienvenido @user a @subject\n\n@desc')
        .replace(/@user/g, `@${username}`)
        .replace(/@subject/g, groupName)
        .replace(/@desc/g, groupDesc)
    : (chat.sBye || '👋 Adiós @user')
        .replace(/@user/g, `@${username}`)
        .replace(/@subject/g, groupName)

  await conn.sendMessage(m.chat, {
    text: msg,
    contextInfo: {
      mentionedJid: [userJid],
      externalAdReply: {
        mediaType: 1,
        showAdAttribution: true,
        title: isWelcome ? '¡Bienvenido!' : '¡Hasta luego!',
        thumbnailUrl: image,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com'
      }
    }
  }, { quoted: m })
}

handler.command = ['setwel']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
