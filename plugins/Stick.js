import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return

  const MAIN_BOT_NUMBER = '593986304370'
  const currentBotNumber = conn.user.jid.split('@')[0]
  if (currentBotNumber !== MAIN_BOT_NUMBER) return

  const STICKER_URLS = [
    'https://files.catbox.moe/0boonh.webp',
    'https://files.catbox.moe/o58tbw.webp'
  ]

  const AUDIO_SALIDA_URL = 'https://files.catbox.moe/33f4o4.opus'
  const AUDIO_BIENVENIDA_URL = 'https://files.catbox.moe/8cm2hc.opus' // Puedes cambiarlo si tienes otro

  if (m.messageStubType === 28 || m.messageStubType === 32) {
    // Salida de un usuario
    setTimeout(async () => {
      try {
        const isSticker = Math.random() < 0.5

        if (isSticker) {
          let url = STICKER_URLS[Math.floor(Math.random() * STICKER_URLS.length)]
          let sticker = await (await fetch(url)).buffer()
          await conn.sendMessage(m.chat, { sticker })
        } else {
          let audio = await (await fetch(AUDIO_SALIDA_URL)).buffer()
          await conn.sendMessage(m.chat, { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true })
        }
      } catch (e) {
        console.error('Error enviando sticker o audio de salida:', e)
      }
    }, 2000)
  }

  if (m.messageStubType === 27) {
    // Entrada de un usuario
    setTimeout(async () => {
      try {
        let audio = await (await fetch(AUDIO_BIENVENIDA_URL)).buffer()
        await conn.sendMessage(m.chat, { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true })
      } catch (e) {
        console.error('Error enviando audio de bienvenida:', e)
      }
    }, 2000)
  }
}

export default handler
