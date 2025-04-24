import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export async function before(m, { conn }) {
  const chat = db.data.chats[m.chat]
  if (!chat.antiver || chat.isBanned) return

  if (m.mtype !== 'viewOnceMessageV2' && m.mtype !== 'viewOnceMessageV2Extension') return

  let viewOnce = m.message?.viewOnceMessageV2?.message || m.message?.viewOnceMessageV2Extension?.message
  if (!viewOnce) return

  const type = Object.keys(viewOnce)[0]
  const content = viewOnce[type]

  if (!content) return

  let stream
  try {
    const mediaType = type === 'imageMessage' ? 'image' : type === 'videoMessage' ? 'video' : null
    if (!mediaType) return

    stream = await downloadContentFromMessage(content, mediaType)
  } catch (e) {
    console.error('Error al descargar media:', e)
    return
  }

  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }

  const caption = (content.caption || '') + (type === 'imageMessage' ? lenguajeGB.smsAntiView2() : lenguajeGB.smsAntiView1())

  try {
    await conn.sendFile(
      m.chat,
      buffer,
      type === 'imageMessage' ? 'foto.jpg' : 'video.mp4',
      caption,
      m,
      false,
      { mentions: [m.sender] }
    )
  } catch (err) {
    console.error('Error al enviar archivo:', err)
  }
}
