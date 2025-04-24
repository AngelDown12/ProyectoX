import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export async function before(m, { conn }) {
  const chat = db.data.chats[m.chat]
  if (!chat.antiver || chat.isBanned) return

  console.log('[ANTIVER] Analizando mensaje...')

  if (m.mtype !== 'viewOnceMessageV2' && m.mtype !== 'viewOnceMessageV2Extension') return

  console.log('[ANTIVER] Mensaje de ver una vez detectado:', m.mtype)

  const viewOnce = m.message?.viewOnceMessageV2?.message || m.message?.viewOnceMessageV2Extension?.message
  if (!viewOnce) {
    console.log('[ANTIVER] No se encontró el mensaje interno.')
    return
  }

  const type = Object.keys(viewOnce)[0]
  const content = viewOnce[type]
  if (!content) {
    console.log('[ANTIVER] No se encontró contenido multimedia.')
    return
  }

  const mediaType = type === 'imageMessage' ? 'image' : type === 'videoMessage' ? 'video' : null
  if (!mediaType) {
    console.log('[ANTIVER] Tipo no soportado:', type)
    return
  }

  console.log(`[ANTIVER] Descargando ${mediaType}...`)

  let stream
  try {
    stream = await downloadContentFromMessage(content, mediaType)
  } catch (e) {
    console.error('[ANTIVER] Error al descargar media:', e)
    return
  }

  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }

  console.log('[ANTIVER] Media descargada, tamaño:', buffer.length)

  const caption = (content.caption || '') + (mediaType === 'image' ? lenguajeGB.smsAntiView2() : lenguajeGB.smsAntiView1())

  try {
    await conn.sendFile(
      m.chat,
      buffer,
      mediaType === 'image' ? 'foto.jpg' : 'video.mp4',
      caption,
      m,
      false,
      { mentions: [m.sender] }
    )
    console.log('[ANTIVER] Archivo enviado correctamente.')
  } catch (err) {
    console.error('[ANTIVER] Error al enviar el archivo:', err)
  }
        }
