import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export async function before(m, { conn }) {
  const chat = db.data.chats[m.chat]
  if (!chat?.antiver || chat?.isBanned) return

  console.log('[ANTIVER] Analizando mensaje...')

  const realMessage = extractMessage(m)
  if (!realMessage) return console.log('[ANTIVER] m.message: null')

  const type = Object.keys(realMessage)[0]
  const content = realMessage[type]

  console.log('[ANTIVER] Tipo de mensaje real:', type)

  let mediaType
  if (type.includes('image')) mediaType = 'image'
  else if (type.includes('video')) mediaType = 'video'
  else return

  try {
    const media = await downloadContentFromMessage(content, mediaType)
    let buffer = Buffer.from([])
    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk])
    }

    const caption = content.caption || ''
    const mensajeFinal = caption + '\n[🔓 Vista única desactivada]'

    const filename = mediaType === 'image' ? 'viewonce.jpg' : 'viewonce.mp4'
    return await conn.sendFile(m.chat, buffer, filename, mensajeFinal, m)
  } catch (e) {
    console.error('[ANTIVER] Error al descargar contenido:', e)
  }
}

function extractMessage(m) {
  let msg = m.message
  if (!msg) return null
  if (msg?.ephemeralMessage?.message) msg = msg.ephemeralMessage.message
  if (msg?.viewOnceMessageV2?.message) msg = msg.viewOnceMessageV2.message
  return msg
}
