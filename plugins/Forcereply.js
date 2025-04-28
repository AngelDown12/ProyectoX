// archivo: plugins/forceReply.js

import { sendMessage } from '@whiskeysockets/baileys'

export async function before(m, { conn, text, args, command }) {
  try {
    // Verifica si el mensaje viene de grupo y es comando
    if (!m.isGroup) return
    if (!m.text.startsWith(global.prefix)) return

    // Si detecta un comando que normalmente se perdería
    console.log(`[FORCE-REPLY] Comando detectado: ${m.text} en ${m.chat}`)

    // Enviar una respuesta forzada al grupo
    await conn.sendMessage(m.chat, { text: `✅ Comando recibido: *${command}*` }, { quoted: m })

  } catch (e) {
    console.error('[FORCE-REPLY-ERROR]', e)
  }
}
