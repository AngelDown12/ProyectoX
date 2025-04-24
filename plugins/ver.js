import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export async function before(m, { conn }) {
  const chat = db.data.chats[m.chat]
  if (!chat.antiver || chat.isBanned) return

  console.log('\n[ANTIVER] Analizando mensaje...')
  console.log('[ANTIVER] m.mtype:', m.mtype)
  console.log('[ANTIVER] m.message:', JSON.stringify(m.message, null, 2))
}
