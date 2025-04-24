let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  // Verificar que el mensaje provenga de un grupo y que sea de tipo bienvenida o despedida
  if (!m.isGroup || !m.messageStubType) return;

  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg'; // Imagen predeterminada

  // Intentar obtener la foto de perfil del usuario o usar la predeterminada si falla.
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA);
  } catch {
    pp = FOTO_PREDETERMINADA;
  }

  let chat = global.db.data.chats[m.chat];

  // Si está configurada la bienvenida manual y el mensaje es de bienvenida (messageStubType: 27)
  if (m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    if (chat.sWelcome) {
      let subject = groupMetadata.subject;
      let userName = `${m.messageStubParameters[0].split('@')[0]}`;

      let textWel = chat.sWelcome
        .replace(/@user/g, `@${userName}`)
        .replace(/@group/g, subject)
        .replace(/@desc/g, groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟");

      let imageUrl = chat.sImage || FOTO_PREDETERMINADA;

      await this.sendMessage(m.chat, {
        text: textWel,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true,
          mentionedJid: [m.sender, m.messageStubParameters[0]],
          externalAdReply: {
            showAdAttribution: true,
            renderLargerThumbnail: true,
            thumbnailUrl: imageUrl,
            title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
            containsAutoReply: true,
            mediaType: 1,
            sourceUrl: 'https://whatsapp.com'
          }
        }
      });
    }
  }

  // Despedida (messageStubType: 28)
  else if (m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split('@')[0]}`;
    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : `*╔══════════════*\n*╟* *SE FUE UNA BASURA*\n*╟*👤 @${userName}* \n*╚══════════════*`;

    let imageUrl = chat.sImage || FOTO_PREDETERMINADA;

    await this.sendMessage(m.chat, {
      text: textBye,
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true,
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃 ',
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: 'https://whatsapp.com'
        }
      }
    });
  }
};

// Comando .setwel para configurar la bienvenida manual
handler.command = ['setwel'];
handler.help = ['setwel <mensaje> <link_imagen>'];
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;
handler.botAdmin = true;

handler.handler = async (m, { conn, text }) => {
  // Verificar si se proporcionó el texto y el enlace de la imagen
  if (!text) {
    return conn.reply(m.chat, '¡Por favor, ingresa el mensaje de bienvenida y el link de la imagen!', m);
  }

  const [message, linkImagen] = text.split(' ');

  // Verificar si ambos parámetros (mensaje y enlace de la imagen) son válidos
  if (!message || !linkImagen) {
    return conn.reply(m.chat, '¡Debes proporcionar tanto el mensaje como el enlace de la imagen!', m);
  }

  // Guardar el mensaje de bienvenida y la imagen en la base de datos del chat
  global.db.data.chats[m.chat].sWelcome = message;
  global.db.data.chats[m.chat].sImage = linkImagen;

  // Desactivar la bienvenida automática para este grupo
  global.db.data.chats[m.chat].welcomeEnabled = false;

  // Confirmación de configuración
  conn.reply(m.chat, `La bienvenida para este grupo se ha configurado correctamente con el mensaje: "${message}" y la imagen: ${linkImagen}. La bienvenida automática ha sido desactivada.`, m);
};

// Comando para restaurar la bienvenida automática
handler.command = ['resetwel'];
handler.help = ['resetwel'];
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;
handler.botAdmin = true;

handler.resetHandler = async (m, { conn }) => {
  // Restaurar la bienvenida automática y eliminar la configuración manual
  global.db.data.chats[m.chat].sWelcome = null;
  global.db.data.chats[m.chat].sImage = null;
  global.db.data.chats[m.chat].welcomeEnabled = true;

  conn.reply(m.chat, 'La bienvenida automática ha sido restaurada y la configuración manual ha sido eliminada.', m);
};

export default handler;
