import fetch from 'node-fetch'

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg'
  const chat = global.db.data.chats[m.chat]
  const isWelcome = chat.welcome !== false

  let userJid = m.messageStubParameters[0]
  let userName = userJid.split('@')[0]
  let subject = groupMetadata.subject
  let descs = groupMetadata.desc || 'Sin descripción'
  let pp = await conn.profilePictureUrl(userJid, 'image').catch(_ => chat.sWelcomeImg || FOTO_PREDETERMINADA)

  let img = await (await fetch(pp)).buffer().catch(_ => null)

  // MENSAJE DE BIENVENIDA
  if (m.messageStubType == 27 && isWelcome) {
    let mensaje = (chat.manualWel && chat.sWelcome) ? chat.sWelcome : `Bienvenido @${userName} a @group\n\n@desc`
    mensaje = mensaje.replace(/@user/g, '@' + userName).replace(/@group/g, subject).replace(/@desc/g, descs)

    await conn.sendMessage(m.chat, {
      text: mensaje,
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋',
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: m })
  }

  // MENSAJE DE DESPEDIDA
  if (m.messageStubType == 28 && isWelcome) {
    let mensaje = (chat.manualWel && chat.sWelcome) ? chat.sBye || 'Adiós @user' : `Adiós @${userName}`
    mensaje = mensaje.replace(/@user/g, '@' + userName).replace(/@group/g, subject)

    await conn.sendMessage(m.chat, {
      text: mensaje,
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋',
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: m })
  }
}
