let handler = async (m, { conn, text }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  let c = (text || q.text || '').trim()
  let users = m.mentionedJid ? m.mentionedJid : [m.sender]
  let watermark = '\n\n©EliteBotGlobal'

  if (mime) {
    let media = await q.download()
    if (!media) return m.reply('No se pudo descargar el medio.')

    await conn.sendFile(m.chat, media, 'media', (c ? c + watermark : watermark), m, false, { mentions: users })
  } else if (c || q.text) {
    const msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [q.mtype ? q.mtype : 'extendedTextMessage']: {
            text: c + watermark,
            contextInfo: {
              mentionedJid: users,
              externalAdReply: null // Elimina tarjetas o vistas previas
            }
          }
        },
        { quoted: m, userJid: conn.user.jid }
      ),
      m
    )
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } else {
    // No hay mensaje válido que citar o texto, no responder
    return
  }
}

handler.help = ['n']
handler.tags = ['tools']
handler.command = /^n$/i
export default handler
