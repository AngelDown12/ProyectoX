let handler = async (m, { conn, text }) => {
  let fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  if (!text || !text.includes('http')) throw `✦ Usa el comando correctamente:\n\n.setwel mensaje @user y @group + URL de imagen\n\nEjemplo:\n.setwel Bienvenido @user a @group 🥳 https://telegra.ph/file/imagen.jpg`

  // Separamos el mensaje del link de la imagen
  const parts = text.split(' ')
  const url = parts.pop()
  const mensaje = parts.join(' ')

  global.db.data.chats[m.chat].sWelcome = mensaje
  global.db.data.chats[m.chat].sWelcomeImage = url

  conn.reply(m.chat, `✔️ Mensaje de bienvenida y foto actualizados.`, fkontak, m)
}

handler.command = ['setwel']
handler.group = true
handler.admin = true
handler.botAdmin = true

// El before para enviar bienvenidas reales
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || m.messageStubType !== 27 || !m.isGroup) return

  let chat = global.db.data.chats[m.chat]
  if (!chat.sWelcome) return

  let subject = groupMetadata.subject
  let descs = groupMetadata.desc || "Sin descripción"
  let userJid = m.messageStubParameters[0]
  let userName = userJid.split('@')[0]

  let mensaje = chat.sWelcome
    .replace(/@user/g, `@${userName}`)
    .replace(/@group/g, subject)
    .replace(/@desc/g, descs)

  let imagen = chat.sWelcomeImage || 'https://telegra.ph/file/1234567890abcdef.jpg'

  await conn.sendMessage(m.chat, {
    text: mensaje,
    contextInfo: {
      mentionedJid: [userJid],
      externalAdReply: {
        title: "🎉 NUEVO MIEMBRO",
        body: "Bienvenido al grupo",
        thumbnailUrl: imagen,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com'
      }
    }
  })
}

export default handler
