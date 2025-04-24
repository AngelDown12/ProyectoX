let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return;

  // Foto predeterminada (reemplaza con tu URL)
  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg';

  // Obtener foto de perfil o usar predeterminada
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA);
  } catch {
    pp = FOTO_PREDETERMINADA;
  }

  let usuario = `@${m.sender.split`@`[0]}`;
  let chat = global.db.data.chats[m.chat];
  let subject = groupMetadata.subject;
  let userName = `${m.messageStubParameters[0].split`@`[0]}`;

  // Mensaje de BIENVENIDA (messageStubType: 27)
  if (m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let descs = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟";

    let defaultWelcome = `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜Ó𝗡 

${descs}

*╟* ¡🇼‌🇪‌🇱‌🇨‌🇴‌🇲‌🇪!
*╚══════════════*`;

    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      .replace(/@desc/g, descs)
      : defaultWelcome;

    // Obtener la imagen configurada o predeterminada
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

  // Mensaje de DESPEDIDA (messageStubType: 28)
  else if (m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟👤 @${userName}* 
*╚══════════════*`;

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye;

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
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
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

  // Validar que el enlace de la imagen sea una URL válida
  const validUrlPattern = /^(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))$/;
  if (!validUrlPattern.test(linkImagen)) {
    return conn.reply(m.chat, '¡El enlace proporcionado no es válido! Asegúrate de usar un enlace correcto de imagen.', m);
  }

  // Guardar el mensaje de bienvenida y el enlace de la imagen en el grupo
  global.db.data.chats[m.chat].sWelcome = message;
  global.db.data.chats[m.chat].sImage = linkImagen;

  conn.reply(m.chat, `La bienvenida para este grupo se ha configurado correctamente con el mensaje: "${message}" y la imagen: ${linkImagen}`, m);
};

export default handler;
