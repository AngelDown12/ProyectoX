let handler = async (m, { conn, text, command }) => {
  // Comando para establecer la imagen de bienvenida
  if (command === 'simularbienvenida' && text) {
    let linkImagen = text.trim(); // Enlace de la imagen proporcionada

    // Guardamos la URL de la imagen en la base de datos del chat
    global.db.data.chats[m.chat].sWelcomeImage = linkImagen;

    // Confirmación de que se ha configurado la imagen correctamente
    return conn.reply(m.chat, `✅ ¡La imagen de bienvenida se ha configurado correctamente!`, m);
  }

  // Verifica si es un evento de entrada de un nuevo miembro (messageStubType 27)
  if (!m.isGroup || m.messageStubType !== 27) return;

  // Obtener la URL de la imagen de bienvenida configurada o predeterminada
  let welcomeImageUrl = global.db.data.chats[m.chat].sWelcomeImage || 'https://qu.ax/Lmiiu.jpg'; // URL predeterminada si no se configuró

  // Nombre del nuevo miembro
  let userName = m.messageStubParameters[0].split('@')[0]; 

  // Nombre del grupo
  let subject = m.chat.name; 

  // Mensaje de bienvenida predeterminado
  let welcomeMessage = `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* ¡Bienvenido al grupo! 🌟
*╚══════════════*`;

  // Enviar el mensaje de bienvenida junto con la imagen
  await conn.sendMessage(m.chat, {
    text: welcomeMessage,
    contextInfo: {
      forwardingScore: 9999999,
      isForwarded: true,
      mentionedJid: [m.sender, m.messageStubParameters[0]],
      externalAdReply: {
        showAdAttribution: true,
        renderLargerThumbnail: true,
        thumbnailUrl: welcomeImageUrl, // Imagen de bienvenida
        title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
        containsAutoReply: true,
        mediaType: 1,
        sourceUrl: 'https://whatsapp.com'
      }
    }
  });
};

handler.command = ['simularbienvenida']; // Comando para establecer la imagen
handler.group = true; // Solo funciona en grupos

export default handler;
