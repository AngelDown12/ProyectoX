import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!/image\/(png|jpe?g)/.test(mime)) {
    return m.reply('Responde a una *imagen* para establecer el icono de bienvenida.', m)
  }

  let media
  try {
    media = await q.download()
  } catch (e) {
    return m.reply('No se pudo descargar la imagen. Intenta de nuevo.', m)
  }

  if (!media) {
    return m.reply('No se recibió ninguna imagen válida.', m)
  }

  const dirPath = path.resolve('./groupIcons')
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // Guardamos todo como JPG para simplificar
  const filePath = path.join(dirPath, `${m.chat}.jpg`)
  fs.writeFileSync(filePath, media)

  // Validación para evitar errores de JID
  if (typeof m.chat !== 'string') {
    return m.reply('Error interno: chat ID inválido.', m)
  }

  await conn.reply(m.chat, '_*La imagen de bienvenida ha sido configurada.*_', m)
}

handler.command = ['setwelcomeimg']
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler
