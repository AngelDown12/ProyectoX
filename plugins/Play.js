import fs from 'fs'
import path from 'path'

const DB_PATH = './database/welcomeImages.json'

function loadDB() {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '{}')
  return JSON.parse(fs.readFileSync(DB_PATH))
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

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

  const filePath = path.join(dirPath, `${m.chat}.jpg`)
  fs.writeFileSync(filePath, media)

  // Guardar en base de datos
  const db = loadDB()
  db[m.chat] = filePath
  saveDB(db)

  let chatId = typeof m.chat === 'string' ? m.chat : (m.key && m.key.remoteJid)

  if (typeof chatId !== 'string') {
    console.error('ID de chat no es un string válido:', chatId)
    return m.reply('Error interno: ID del chat inválido.')
  }

  await conn.sendMessage(chatId, { text: '_*La imagen de bienvenida ha sido configurada.*_' }, { quoted: m })
}

handler.command = ['setwelcomeimg']
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler
