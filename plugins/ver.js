import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
  let media, msg, type
  const { antiver, isBanned } = global.db.data.chats[m.chat]
  
  // Verifica si la protección anti vista única está habilitada
  if (!antiver || isBanned) return
  
  // Si el mensaje es de tipo 'viewOnceMessageV2' o 'viewOnceMessageV2Extension'
  if (m.mtype === 'viewOnceMessageV2' || m.mtype === 'viewOnceMessageV2Extension') {
    msg = m.mtype === 'viewOnceMessageV2' ? m.message.viewOnceMessageV2.message : m.message.viewOnceMessageV2Extension.message
    type = Object.keys(msg)[0]
    
    try {
      // Descarga el contenido según el tipo de mensaje
      if (type === 'imageMessage' || type === 'videoMessage') {
        media = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video')
      } else if (type === 'audioMessage') {
        media = await downloadContentFromMessage(msg[type], 'audio')
      }
      
      let buffer = Buffer.from([])
      for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
      }

      // Formateamos la descripción
      const description = `
✅️ *ANTI VER UNA VEZ* ✅️

💭 *No ocultes* ${type === 'imageMessage' ? '`Imagen` 📷' : type === 'videoMessage' ? '`Vídeo` 🎥' : type === 'audioMessage' ? '`Mensaje de voz` 🎤' : 'este mensaje'}

- ✨️ *Usuario:* *@${m.sender.split('@')[0]}*
${msg[type].caption ? `- *Texto:* ${msg[type].caption}` : ''}`.trim()
      
      // Reenvía el mensaje al grupo con la advertencia
      if (/image|video/.test(type)) {
        await conn.sendFile(m.chat, buffer, 'error.' + (type === 'imageMessage' ? 'jpg' : 'mp4'), description, m, false, { mentions: [m.sender] })
      }
      
      if (/audio/.test(type)) {
        await conn.reply(m.chat, description, m, { mentions: [m.sender] })
        await conn.sendMessage(m.chat, { audio: buffer, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
      }
      
    } catch (error) {
      console.error('Error al procesar el mensaje de vista única:', error)
    }
  }
}

export default handler
