import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  // Reemplaza con el número de tu bot principal (sin +, espacios o prefijos)
  const MAIN_BOT_NUMBER = '593986304370' // Ejemplo: número en formato 521234567890
  
  // Extraer solo el número del JID del bot actual (elimina '@s.whatsapp.net' o '@c.us')
  const currentBotNumber = conn.user.jid.split('@')[0]
  
  // Verificar si el bot actual es el bot principal comparando solo los números
  if (currentBotNumber !== MAIN_BOT_NUMBER) return

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
