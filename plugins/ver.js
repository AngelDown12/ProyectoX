import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = m => m
handler.before = async function (m, { conn }) {
  const chat = db.data.chats[m.chat]
  if (!chat?.antiver || chat?.isBanned) return

  console.log('[ANTIVER] Analizando mensaje...')

  let msg = m.message
  if (!msg) return console.log('[ANTIVER] m.message: null')

  // Desempaquetar mensajes efímeros y de vista única
  if (msg?.ephemeralMessage) msg = msg.ephemeralMessage.message
  if (msg?.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message
  if (!msg) return console.log('[ANTIVER] viewOnce interno null')

  const type = Object.keys(msg)[0]
  const content = msg[type]

  let mediaType
  if (type.includes('image')) mediaType = 'image'
  else if (type.includes('video')) mediaType = 'video'
  else return

  try {
    const media = await downloadContentFromMessage(content, mediaType)
    let buffer = Buffer.from([])
    for await (const chunk of media) buffer = Buffer.concat([buffer, chunk])

    const caption = content.caption || ''
    const message = caption + '\n[🔓 Vista única desactivada]'
    const fileName = mediaType === 'image' ? 'viewonce.jpg' : 'viewonce.mp4'

    await conn.sendFile(m.chat, buffer, fileName, message, m)
  } catch (e) {
    console.error('[ANTIVER] Error al manejar mensaje de vista única:', e)
  }
}

export default handler
