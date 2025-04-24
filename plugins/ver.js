let handler = m => m;

// Este "before" es el que se ejecuta antes de cada mensaje para gestionar las bienvenidas y despedidas.
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.isGroup || !m.messageStubType) return;

  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg'; // Imagen predeterminada

  // Intentar obtener la foto de perfil del usuario o usar la predeterminada si falla.
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA);
  } catch {
    pp = FOTO_PREDETERMINADA;
  }

  let usuario = `@${m.sender.split('@')[0]}`;
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

// Registrar el comando .setwel para configurar el mensaje manual
handler.command = ['setwel']; // Este es el comando
handler.help = ['setwel <mensaje> <link_imagen>']; // Instrucciones
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;
handler.botAdmin = true;

handler.handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, '¡Por favor, ingresa el mensaje de bienvenida y el link de la imagen!', m);
  }

  const [message, linkImagen] = text.split(' ');

  if (!linkImagen) {
    return conn.reply(m.chat, '¡Debes proporcionar tanto el mensaje como el enlace de la imagen!', m);
  }

  // Guardar el mensaje y la imagen en la base de datos del chat
  global.db.data.chats[m.chat].sWelcome = message;
  global.db.data.chats[m.chat].sImage = linkImagen;

  // Desactivar la bienvenida automática para este grupo
  global.db.data.chats[m.chat].welcomeEnabled = false;

  // Enviar confirmación al chat
  conn.reply(m.chat, `La bienvenida para este grupo se ha configurado correctamente con el mensaje: "${message}" y la imagen: ${linkImagen}. La bienvenida automática ha sido desactivada.`, m);
};

// Comando para restaurar la bienvenida automática
handler.command = ['resetwel'];
handler.help = ['resetwel'];
handler.tags = ['owner'];
handler.owner = true
