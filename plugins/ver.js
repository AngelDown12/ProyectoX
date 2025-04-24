let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin, command, text }) {
  // Verifica si el mensaje es de un grupo y si contiene el tipo adecuado
  if (!m.messageStubType || !m.isGroup) return;

  // Foto predeterminada (reemplaza con tu URL si no se proporciona una imagen personalizada)
  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg';

  // Comando para configurar la bienvenida con imagen
  if (command === 'simularbienvenida' && text) {
    let welcomeImageUrl = text.trim();  // URL de la imagen proporcionada
    let chat = global.db.data.chats[m.chat];
    chat.sWelcomeImage = welcomeImageUrl;  // Guardamos la URL de la imagen en la base de datos
    return conn.reply(m.chat, `✅ ¡La imagen de bienvenida se ha configurado con éxito!`, m);
  }

  // Obtener foto de perfil o usar la predeterminada si no se encuentra
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA);
  } catch {
    pp = FOTO_PREDETERMINADA;
  }

  let usuario = `@${m.sender.split`@`[0]}`;
  let chat = global.db.data.chats[m.chat];
  let users = participants.map(u => conn.decodeJid(u.id));

  // Mensaje de BIENVENIDA (messageStubType: 27)
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject;
    let descs = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟";
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;

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

    // Usar la imagen configurada por el usuario, si existe
    let welcomeImageUrl = chat.sWelcomeImage || FOTO_PREDETERMINADA;

    // Enviar mensaje de bienvenida con la imagen
    await this.sendMessage(m.chat, { 
      text: textWel, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: welcomeImageUrl,  // Usamos la URL de la imagen configurada
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: fkontak });
  }

  // Mensaje de DESPEDIDA (messageStubType: 28)
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟👤 @${userName}* 
*╚══════════════*`;

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye;

    // Verificamos si se ha configurado una imagen personalizada para la despedida
    let byeImageUrl = chat.sByeImage || FOTO_PREDETERMINADA;

    // Enviamos el mensaje de despedida con la imagen
    await this.sendMessage(m.chat, { 
      text: textBye, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: byeImageUrl,  // Usamos la URL configurada para la despedida
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃 ',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: fkontak });
  }
}

export default handler;
