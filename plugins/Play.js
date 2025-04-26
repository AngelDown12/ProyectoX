import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image\/(png|jpe?g)/i.test(mime)) {
      return m.reply('Responde a una *imagen* para establecer el icono de bienvenida.', m)
    }

    let media
    try {
      media = await q.download()
    } catch (e) {
      console.error('Error descargando la imagen:', e)
      return m.reply('No se pudo descargar la imagen. Intenta de nuevo.', m)
    }

    if (!media) {
      return m.reply('No se recibió ninguna imagen válida.', m)
    }

    const dirPath = path.resolve('./groupIcons')
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    const filePath = path.join(dirPath, `${m.chat}.jpg`)
    fs.writeFileSync(filePath, media)

    // Confirmamos que el ID sea válido
    let chatId = typeof m.chat === 'string' ? m.chat : (m.key?.remoteJid || '')

    if (!chatId || !chatId.includes('@')) {
      console.error('Chat ID inválido:', chatId)
      return m.reply('Error interno: no se pudo enviar confirmación.')
    }

    await conn.sendMessage(chatId, { text: '_*La imagen de bienvenida ha sido configurada exitosamente.*_' }, { quoted: m })

  } catch (error) {
    console.error('Error en setwelcomeimg:', error)
    await m.reply('Ocurrió un error al procesar tu solicitud.')
  }
}

handler.command = ['setwelcomeimg']
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler
