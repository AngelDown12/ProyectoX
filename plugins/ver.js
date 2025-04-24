let handler = async (m, { conn }) => {
  // Verificar si el mensaje contiene una imagen
  if (m.message && m.message.imageMessage) {
    // Revisar si ya se ha procesado una imagen antes en el grupo
    let groupData = global.groupImageStatus || {};

    // Si es la primera vez que se envía una imagen, reenviamos el mensaje
    if (!groupData[m.chat]) {
      // Marcar que se ha procesado una imagen en el grupo
      groupData[m.chat] = true;
      global.groupImageStatus = groupData;

      // Reenviar la imagen
      await conn.sendMessage(m.chat, { image: m.message.imageMessage, caption: '🚫 En este grupo no se permite enviar imágenes de 1 sola vez. 🚫' }, { quoted: m });

      // Mandar el mensaje de advertencia
      await m.reply('🚫 En este grupo no se permite enviar imágenes de 1 sola vez. 🚫');
    }
  }
};

// Configuración universal
handler.command = /^.*$/i; // Escuchar todos los mensajes
handler.tags = ['anti']; // Etiqueta para organizar comandos
export default handler;
