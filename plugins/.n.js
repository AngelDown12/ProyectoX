const handler = async (m, { conn, text, participants, args }) => {
  try {
    if (args.length >= 1) {
      text = args.join(" ")
    } else if (m.quoted && m.quoted.text) {
      text = m.quoted.text
    } else return

    const users = participants.map((u) => conn.decodeJid(u.id))
    await conn.sendMessage(m.chat, {
      text: text,
      contextInfo: { mentionedJid: users }
    }, { quoted: m })

  } catch (e) {
    const users = participants.map((u) => conn.decodeJid(u.id))
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /image|video/.test(mime)
    const htextos = text ? text : '📣📣📣'

    if (isMedia && quoted.mtype === 'imageMessage') {
      const mediax = await quoted.download?.()
      await conn.sendMessage(m.chat, {
        image: mediax,
        caption: htextos,
        contextInfo: { mentionedJid: users }
      }, { quoted: m })

    } else if (isMedia && quoted.mtype === 'videoMessage') {
      const mediax = await quoted.download?.()
      await conn.sendMessage(m.chat, {
        video: mediax,
        caption: htextos,
        mimetype: 'video/mp4',
        contextInfo: { mentionedJid: users }
      }, { quoted: m })

    } else {
      await conn.sendMessage(m.chat, {
        text: htextos,
        contextInfo: { mentionedJid: users }
      }, { quoted: m })
    }
  }
}

handler.command = /^(hidetag|notificar|notify|aviso|avisar|noti|avisa)$/i
handler.group = true
handler.admin = true
handler.register = true
handler.botAdmin = true

export default handler
