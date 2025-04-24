let handler = async (m, { conn, text, command }) => {
  // Comando para establecer la imagen de bienvenida
  if (command === 'simularbienvenida' && text) {
    let linkImagen = text.trim(); // Enlace de la imagen proporcionada

    // Guardamos la URL de la imagen en una variable global
    global.db.data.chats[m.chat].sWelcomeImage = linkImagen;

    // Enviar confirmación
    return conn.reply(m.chat, `✅ ¡La imagen de bienvenida se ha configurado correctamente!`, m);
  }

  // Verifica si es un mensaje de grupo y si un nuevo miembro ha sido agregado (evento de bienvenida)
  if (!m.isGroup || m.messageStubType !== 27) return;

  // Obtener la URL de la imagen de bienvenida configurada o predeterminada
  let welcomeImageUrl = global.db.data.chats[m.chat].sWelcomeImage || 'https://qu.ax/Lmiiu.jpg'; // URL predeterminada si no se configuró

  let userName = m.messageStubParameters[0].split('@')[0]; // Nombre del nuevo miembro
  let subject = m.chat.name; // Nombre del grupo

  // Crear el mensaje de bienvenida
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
        thumbnailUrl: welcomeImageUrl, // Usar la imagen de bienvenida
        title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
        containsAutoReply: true,
        mediaType: 1,
        sourceUrl: 'https://whatsapp.com'
      }
    }
  });
};

handler.command = ['simularbienvenida']; // Definir el comando
handler.group = true; // Solo funciona en grupos

export default handler;
