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
  };

  // Si el texto proporcionado contiene una URL de imagen, la usamos para la bienvenida
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text; // Guardamos el mensaje de bienvenida
    conn.reply(m.chat, `✔️ ¡Bienvenida configuración guardada! Ahora, cada vez que un nuevo miembro se una al grupo, se enviará el mensaje de bienvenida con la imagen proporcionada.`, fkontak, m);
  } else {
    // Si no se proporciona texto, mostramos un mensaje de error
    throw `✦ ¡Hola! Te ayudaré a configurar la bienvenida.

    > Para configurar la bienvenida, usa el siguiente comando:

    .setwelcome [Mensaje de bienvenida] [URL de la imagen]

    Ejemplo:

    .setwelcome ¡Bienvenido al grupo @user! @group, disfruta del ambiente. 🌟 [URL de la imagen]`;
  }
}

handler.command = ['setwelcome', 'bienvenida']; // El comando para configurar la bienvenida
handler.botAdmin = true; // Aseguramos que el bot tenga permisos de administrador
handler.admin = true; // Solo administradores pueden configurar la bienvenida
handler.group = true; // Funciona solo en grupos

// Esta parte es para enviar la bienvenida cuando un nuevo miembro se una
let handlerWelcome = async (m, { conn, participants, groupMetadata }) => {
  // Verificamos si el mensaje es de tipo bienvenida (nuevo miembro)
  if (!m.messageStubType || m.messageStubType !== 27) return;

  let subject = groupMetadata.subject; // Nombre del grupo
  let userName = `${m.messageStubParameters[0].split`@`[0]}`; // Nombre del nuevo miembro
  let descs = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟"; // Descripción del grupo

  // Obtenemos el mensaje de bienvenida configurado
  let welcomeMsg = global.db.data.chats[m.chat].sWelcome || `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜Ó𝗡 

${descs}

*╟* ¡🇼‌🇪‌🇱‌🇨‌🇴‌🇲‌🇪!
*╚══════════════*`;

  // Reemplazamos los placeholders en el mensaje
  let textWel = welcomeMsg
    .replace(/@user/g, `@${userName}`)
    .replace(/@group/g, subject) 
    .replace(/@desc/g, descs);

  // Enviamos el mensaje de bienvenida con la imagen configurada
  await this.sendMessage(m.chat, { 
    text: textWel, 
    contextInfo: {
      forwardingScore: 9999999,
      isForwarded: true, 
      mentionedJid: [m.sender, m.messageStubParameters[0]],
      externalAdReply: {
        showAdAttribution: true,
        renderLargerThumbnail: true,
        thumbnailUrl: global.db.data.chats[m.chat].sWelcomeImage || 'https://default-image-url.com',  // Usamos la URL proporcionada
        title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
        containsAutoReply: true,
        mediaType: 1, 
        sourceUrl: 'https://whatsapp.com'
      }
    }
  });
}

handler.before = handlerWelcome; // Asocia la función de bienvenida cuando un miembro entra al grupo

export default handler;
