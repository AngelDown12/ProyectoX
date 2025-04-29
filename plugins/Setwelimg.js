let handler = async (m, { conn, text, isROwner, isOwner }) => {
  let fkontak = { 
    "key": { 
      "participants": "0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Halo" 
    }, 
    "message": { 
      "contactMessage": { 
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
      }
    }, 
    "participant": "0@s.whatsapp.net" 
  }

  if (m.quoted && m.quoted.mtype === 'imageMessage') {
    // Si el mensaje es una imagen, guardamos la imagen como la bienvenida
    let image = await m.quoted.download(); // Descargar la imagen
    global.db.data.chats[m.chat].sWelcomeImage = image; // Guardamos la imagen en la base de datos del chat
    conn.reply(m.chat, lenguajeGB.smsSetImage(), fkontak, m); // Responde confirmando que se configuró la imagen
  } else {
    throw `✦ ¡Hola!
Te ayudaré a configurar la imagen de bienvenida.

💡 Para configurar una imagen de bienvenida, simplemente responde a este comando con una imagen.

💫 Ejemplo:
.envía una imagen y luego usa el comando .setweimg para configurarla como la imagen de bienvenida.`;
  }
}

handler.command = ['setweimg', 'bienvenidaimg']
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler
