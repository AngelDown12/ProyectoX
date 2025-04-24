let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return;

  // Foto predeterminada (reemplaza con tu URL)
  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg';

  // Obtener foto de perfil o usar predeterminada
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA);
  } catch {
    pp = FOTO_PREDETERMINADA;
  }

  let usuario = `@${m.sender.split('@')[0]}`;
  let chat = global.db.data.chats[m.chat];
  let subject = groupMetadata.subject;
  let userName = `${m.messageStubParameters[0].split('@')[0]}`;

  // Verificar si el mensaje es de bienvenida (messageStubType: 27)
  if (m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    // Si hay configuración manual, usa esa bienvenida
    if (chat.sWelcome) {
      let textWel = chat.sWelcome
        .replace(/@user/g, `@${userName}`)
        .replace(/@group/g, subject)
        .replace(/@desc/g, groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟");

      // Usar la imagen configurada o la predeterminada
      let imageUrl = chat.sImage || FOTO_PREDETERMINADA;

      // Enviar mensaje de bienvenida con imagen
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
            title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝕃𝔸𝕃',
            containsAutoReply: true,
            mediaType: 1,
            sourceUrl: 'https://whatsapp.com'
          }
        }
      });
    }
  }

  // Verificar si el mensaje es de despedida (messageStubType: 28)
  else if (m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟👤 @${userName}* 
*╚══════════════*`;

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye;

    // Usar la misma imagen de bienvenida para la despedida (puede ser diferente)
    let imageUrl = chat.sImage || FOTO_PREDETERMINADA;

    // Enviar mensaje de despedida con imagen
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
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝕃𝔸𝕃 ',
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: 'https://whatsapp.com'
        }
      }
    });
  }
};

// Comando .setwel para configurar la bienvenida manualmente
handler.command = ['setwel'];
handler.help = ['setwel <mensaje> <link_imagen>'];
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;
handler.botAdmin = true;

handler.handler = async (m, { conn, text, command }) => {
  if (!text) {
    return conn.reply(m.chat, '¡Por favor, ingresa el mensaje de bienvenida y el link de la imagen!', m);
  }

  const [message, linkImagen] = text.split(' ');

  if (!linkImagen) {
    return conn.reply(m.chat, '¡Debes proporcionar tanto el mensaje como el enlace de la imagen!', m);
  }

  // Guardar el mensaje de bienvenida y el enlace de la imagen en el grupo
  global.db.data.chats[m.chat].sWelcome = message;
  global.db.data.chats[m.chat].sImage = linkImagen;

  // Desactivar la bienvenida automática en este grupo
  global.db.data.chats[m.chat].welcomeEnabled = false;

  // Enviar confirmación al chat
  conn.reply(m.chat, `La bienvenida para este grupo se ha configurado correctamente con el mensaje: "${message}" y la imagen: ${linkImagen}. La bienvenida automática ha sido desactivada.`, m);
};

// Comando .resetwel para restaurar la bienvenida automática
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
