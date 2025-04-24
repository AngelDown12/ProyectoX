let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('http')) throw `✦ Usa el comando correctamente:\n\n.setwel mensaje @user @group @desc URL\n\nEjemplo:\n.setwel Bienvenido @user a @group. @desc https://telegra.ph/file/imagen.jpg`

  let parts = text.trim().split(' ')
  let url = parts.pop()
  let mensaje = parts.join(' ')

  global.db.data.chats[m.chat].sWelcome = mensaje
  global.db.data.chats[m.chat].sWelcomeImage = url

  conn.reply(m.chat, `✅ Mensaje de bienvenida/despedida y foto configurados correctamente.`, null, m)
}
handler.command = ['setwel']
handler.group = true
handler.admin = true
handler.botAdmin = true

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const chat = global.db.data.chats[m.chat]
  if (!chat.sWelcome || !chat.sWelcomeImage) return

  const subject = groupMetadata.subject
  const descs = groupMetadata.desc || 'Sin descripción'
  const userJid = m.messageStubParameters[0]
  const userName = userJid.split('@')[0]
  const imagen = chat.sWelcomeImage
  const mensajeBase = chat.sWelcome

  const mensaje = mensajeBase
    .replace(/@user/g, `@${userName}`)
    .replace(/@group/g, subject)
    .replace(/@desc/g, descs)

  if ([27, 28].includes(m.messageStubType)) {
    const titulo = m.messageStubType === 27 ? '🎉 NUEVO MIEMBRO' : '👋 SE FUE UN MIEMBRO'

    await conn.sendMessage(m.chat, {
      text: mensaje,
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          title: titulo,
          body: mensaje,
          thumbnailUrl: imagen,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://whatsapp.com'
        }
      }
    })
  }
}

export default handler
