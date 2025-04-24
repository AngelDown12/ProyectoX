let handler = m => m;
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

  let chat = global.db.data.chats[m.chat];

  // Si la bienvenida está activada manualmente, no enviar la automática.
  if (chat.sWelcome && m.messageStubType == 27) {
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
  
  // Si la bienvenida no está activada, enviar la bienvenida automática
  else if (m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split('@')[0]}`;

    let defaultWelcome = `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜Ó𝗡 

🌟 ¡Bienvenido al grupo! 🌟

*╚══════════════*`;

    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      .replace(/@desc/g, groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟")
      : defaultWelcome;

    let imageUrl = FOTO_PREDETERMINADA;

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

  // Despedida
  if (m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split('@')[0]}`;
    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : `*╔══════════════*\n*╟* *SE FUE UNA BASURA*\n*╟👤 @${userName}* \n*╚══════════════*`;

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

// Configurar la bienvenida manual
handler.command = ['setwel'];
handler.help = ['setwel <mensaje> <link_imagen>'];
handler.owner = true;
handler.group = true;
handler.botAdmin = true;

handler.handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, '¡Por favor, ingresa el mensaje de bienvenida y el link de la imagen!', m);
  }

  const [message, linkImagen] = text.split(' ');

  if (!message || !linkImagen) {
    return conn.reply(m.chat, '¡Debes proporcionar tanto el mensaje como el enlace de la imagen!', m);
  }

  global.db.data.chats[m.chat].sWelcome = message;
  global.db.data.chats[m.chat].sImage = linkImagen;

  // Desactivar bienvenida automática
  global.db.data.chats[m.chat].welcomeEnabled = false;

  conn.reply(m.chat, `La bienvenida para este grupo ha sido configurada correctamente.\nMensaje: ${message}\nImagen: ${linkImagen}`, m);
};

export default handler;
