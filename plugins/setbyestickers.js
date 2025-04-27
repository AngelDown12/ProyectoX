import fetch from 'node-fetch'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  // URL del sticker para la despedida
  const STICKER_URL = 'https://files.catbox.moe/g3hyc2.webp'

  // Solo si el mensaje es de tipo "salida de usuario"
  if (m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    // Retrasar 2 segundos antes de enviar el sticker
    setTimeout(async () => {
      // Obtener el sticker desde la URL
      let sticker = await (await fetch(STICKER_URL)).buffer()
      
      // Enviar el sticker
      await conn.sendMessage(m.chat, { 
        sticker: sticker  // Enviar el sticker
      })
    }, 2000)  // Retraso de 2 segundos (puedes ajustar el tiempo)
  }
}

export default handler
