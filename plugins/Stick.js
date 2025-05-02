import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return

  const MAIN_BOT_NUMBER = '593986304370'
  const currentBotNumber = conn.user.jid.split('@')[0]
  if (currentBotNumber !== MAIN_BOT_NUMBER) return

  const STICKER_URLS = [
    'https://files.catbox.moe/o7q3wx.ogg',
    'https://files.catbox.moe/o7q3wx.ogg'
  ]

  const AUDIO_SALIDA_URLS = [
    'https://files.catbox.moe/33f4o4.opus',
    'https://files.catbox.moe/2q3vta.opus',
    'https://files.catbox.moe/mo22fl.opus'
  ]
  const AUDIO_BIENVENIDA_URL = 'https://files.catbox.moe/8cm2hc.opus'

  try {
    if ([28, 32].includes(m.messageStubType)) {
      // Usuario salió del grupo
      setTimeout(async () => {
        const isSticker = Math.random() < 0.5
        if (isSticker) {
          const url = STICKER_URLS[Math.floor(Math.random() * STICKER_URLS.length)]
          const sticker = await (await fetch(url)).buffer()
          await conn.sendMessage(m.chat, { sticker })
        } else {
          const url = AUDIO_SALIDA_URLS[Math.floor(Math.random() * AUDIO_SALIDA_URLS.length)]
          const audio = await (await fetch(url)).buffer()
          await conn.sendMessage(m.chat, {
            audio,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
          })
        }
      }, 2000)
    }

    if (m.messageStubType === 27) {
      // Usuario entró al grupo
      setTimeout(async () => {
        const audio = await (await fetch(AUDIO_BIENVENIDA_URL)).buffer()
        await conn.sendMessage(m.chat, {
          audio,
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true
        })
      }, 2000)
    }
  } catch (e) {
    console.error('Error manejando entrada/salida de grupo:', e)
  }
}

export default handler
