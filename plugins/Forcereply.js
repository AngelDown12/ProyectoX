// archivo: plugins/fixReply.js

import { delay } from '@whiskeysockets/baileys'

export async function before(m, { conn, text, args, command }) {
  if (!m.isGroup) return
  if (!m.text.startsWith(global.prefix)) return

  try {
    console.log(`[FIX-REPLY] Intentando responder comando ${command} en ${m.chat}`)

    // Intentar enviar normalmente
    await conn.sendMessage(m.chat, { text: `✅ Comando procesado: *${command}*` }, { quoted: m })

  } catch (e) {
    console.error('[FIX-REPLY ERROR]', e)

    // Intentar reconectar si falla
    try {
      console.log('[FIX-REPLY] Reintentando reconexión...')
      await conn.ws.close()
      await delay(3000) // esperar 3 segundos
      await conn.connect()
      console.log('[FIX-REPLY] Reconectado exitosamente.')

      // Reintentar enviar mensaje después de reconectar
      await conn.sendMessage(m.chat, { text: `✅ Bot reconectado. Comando: *${command}*` }, { quoted: m })

    } catch (reconnectError) {
      console.error('[FIX-REPLY RECONNECT ERROR]', reconnectError)
    }
  }
}
