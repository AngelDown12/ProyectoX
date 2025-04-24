let handler = async (m, { conn, text, command }) => {
  // Verifica que el comando sea .simularbienvenida y que se haya proporcionado un enlace de imagen
  if (command === 'simularbienvenida' && text) {
    let linkImagen = text.trim(); // Obtenemos la URL de la imagen proporcionada
    let chat = global.db.data.chats[m.chat];
    
    // Guardamos la URL de la imagen en la base de datos
    chat.sWelcomeImage = linkImagen;
    
    // Enviamos un mensaje de confirmación al grupo
    return conn.reply(m.chat, `✅ ¡La imagen de bienvenida se ha configurado correctamente!`, m);
  }
  
  // Aquí comenzamos con la lógica para los mensajes de bienvenida y despedida
  if (!m.isGroup) return;

  let chat = global.db.data.chats[m.chat];
  
  // Verifica si hay una imagen personalizada para la bienvenida
  let welcomeImageUrl = chat.sWelcomeImage || 'https://qu.ax/Lmiiu.jpg';  // Imagen predeterminada si no se configuró

  if (m.messageStubType == 27) { // Este es el tipo de mensaje que indica que un usuario ha entrado al grupo
    let userName = `${m.messageStubParameters[0].split`@`[0]}`; // Obtenemos el nombre del nuevo miembro
    let subject = m.chat.name; // Nombre del grupo

    let welcomeMessage = `*╔══════════════*
*╟* 𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢/𝗔
*╠══════════════*
*╟*🛡️ *${subject}*
*╟*👤 *@${userName}*
*╟* ¡Bienvenido al grupo! 🌟
*╚══════════════*`;

    // Enviamos el mensaje de bienvenida con la imagen configurada
    await conn.sendMessage(m.chat, { 
      text: welcomeMessage, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: welcomeImageUrl, // Usamos la URL de la imagen configurada
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    });
  }
};

handler.command = ['simularbienvenida']; // Comando para establecer la bienvenida
handler.group = true; // Solo funciona en grupos

export default handler;
