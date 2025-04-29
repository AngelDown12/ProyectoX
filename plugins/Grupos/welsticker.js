/*import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  const STICKER_URL = 'https://files.catbox.moe/g3hyc2.webp'

  // Detectar si fue expulsión (28) o salida voluntaria (32)
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    setTimeout(async () => {
      let sticker = await (await fetch(STICKER_URL)).buffer()
      await conn.sendMessage(m.chat, { 
        sticker: sticker 
      })
    }, 2000)  // 2 segundos de espera
  }
}

export default handler
*/
