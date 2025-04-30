

import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return

  const MAIN_BOT_NUMBER = '593986304370'
  const currentBotNumber = conn.user.jid.split('@')[0]
  if (currentBotNumber !== MAIN_BOT_NUMBER) return

  // Lista de stickers aleatorios (puedes agregar más enlaces)
  const STICKER_URLS = [
    'https://files.catbox.moe/g3hyc2.webp',
    'https://files.catbox.moe/abcd12.webp',
    'https://files.catbox.moe/g3hyc2.webp',
    'https://files.catbox.moe/abcd12.webp'
  ]

  if (m.messageStubType === 28 || m.messageStubType === 32) {
    setTimeout(async () => {
      try {
        let url = STICKER_URLS[Math.floor(Math.random() * STICKER_URLS.length)]
        let sticker = await (await fetch(url)).buffer()
        await conn.sendMessage(m.chat, { sticker })
      } catch (e) {
        console.error('Error enviando sticker de salida:', e)
      }
    }, 2000)
  }
}

export default handler

