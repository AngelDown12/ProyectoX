import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
  let media, msg, type
  const { antiver, isBanned } = global.db.data.chats[m.chat]
  
  // Verifica si la protección anti vista única está habilitada
  if (!antiver || isBanned) {
    console.log('Protección anti ver no está habilitada o está baneado el chat.');
    return
  }
  
  // Verifica si el mensaje es de tipo 'viewOnceMessageV2' o 'viewOnceMessageV2Extension'
  if (m.mtype === 'viewOnceMessageV2' || m.mtype === 'viewOnceMessageV2Extension') {
    console.log('Mensaje viewOnce detectado');
    
    msg = m.mtype === 'viewOnceMessageV2' ? m.message.viewOnceMessageV2.message : m.message.viewOnceMessageV2Extension.message
    type = Object.keys(msg)[0]
    
    try {
      // Depuración: muestra el tipo de mensaje y el contenido
      console.log('Tipo de mensaje:', type);
      console.log('Contenido del mensaje:', msg[type]);

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

💭 *No ocultes* ${type === 'imageMessage' ? '`Imagen` 📷' : type === 'videoMessage' ? '`Vídeo` 🎥' : type === 'audioMessage' ?
