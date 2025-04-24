let handler = async (m, { conn, text, args, isROwner, isOwner }) => {
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
  };

  // Verificamos que se haya proporcionado un enlace de imagen
  if (args.length < 1) return m.reply(`Por favor, proporciona el enlace de la imagen para la bienvenida.\nEjemplo: .simularbienvenida <link_de_imagen>`);

  let imageUrl = args[0];  // El primer argumento es el enlace de la imagen

  // Validamos que el enlace sea una imagen válida
  if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/)) {
    return m.reply('El enlace proporcionado no es una URL válida de imagen. Por favor, ingresa un enlace válido.');
  }

  // Guardamos la URL de la imagen en la base de datos (si es necesario)
  global.db.data.chats[m.chat].sWelcomeImage = imageUrl;

  // Respuesta confirmando que se ha guardado la configuración de bienvenida
  conn.reply(m.chat, `¡La imagen de bienvenida ha sido configurada correctamente! 🎉\nAhora, cada vez que un nuevo miembro ingrese al grupo, se les dará la bienvenida con la imagen proporcionada.`, fkontak, m);

  // Ahora, cuando un nuevo miembro ingrese, enviaremos el mensaje de bienvenida y la imagen.
  conn.ev.on('group-participants-update', async (update) => {
    if (update.action === 'add') {
      let newMember = update.participants[0];
      let welcomeMessage = `¡Bienvenid@ al grupo, @${newMember}! 🎉🎉\nDisfruta y participa activamente.`;

      // Enviamos el mensaje de bienvenida con la etiqueta del nuevo miembro
      await conn.sendMessage(update.id, {
        text: welcomeMessage,
        mentions: [newMember],
      });

      // Enviamos la imagen de bienvenida configurada previamente
      await conn.sendMessage(update.id, { image: { url: global.db.data.chats[m.chat].sWelcomeImage }, caption: welcomeMessage });
    }
  });
};

handler.command = ['simularbienvenida', 'setwelcome'];
handler.botAdmin = true;
handler.admin = true;
handler.group = true;
export default handler;
