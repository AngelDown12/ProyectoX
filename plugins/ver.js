let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (args.length < 1) return m.reply(`Por favor, ingresa el link de la imagen para la bienvenida.\nUso: ${usedPrefix + command} <link_de_imagen>`);

  // El primer argumento debe ser el link de la imagen
  let imageUrl = args[0];
  
  // Validar si el link de imagen es correcto
  if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/)) {
    return m.reply('El link proporcionado no es una URL válida de imagen. Por favor, ingresa un link de imagen válido.');
  }

  // Mensaje que se enviará al grupo cuando un nuevo miembro entre
  const welcomeMessage = `¡Bienvenid@ al grupo, @user! 🎉🎉\nDisfruta y participa activamente.`;

  // Escuchamos el evento de participación en el grupo
  conn.ev.on('group-participants-update', async (update) => {
    if (update.action === 'add') {
      // Comprobamos si la acción es 'add' (nuevo miembro ingresando)
      let newMember = update.participants[0];
      
      // Enviamos el mensaje de bienvenida con la imagen
      await conn.sendMessage(update.id, {
        text: welcomeMessage.replace('@user', `@${newMember}`), 
        mentions: [newMember],
      });

      // Enviar la imagen de bienvenida con el link proporcionado
      await conn.sendMessage(update.id, { image: { url: imageUrl }, caption: welcomeMessage.replace('@user', `@${newMember}`) });
    }
  });

  m.reply('¡Comando para simular bienvenidas activado! Ahora, cada vez que un nuevo miembro entre al grupo, recibirán la bienvenida con la imagen proporcionada.');
};

handler.help = ['simularbienvenida <link>'];
handler.tags = ['owner'];
handler.command = /^simularbienvenida$/i;
handler.group = true;

export default handler;
