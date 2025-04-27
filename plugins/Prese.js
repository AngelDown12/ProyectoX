let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return; // Evento: Creación de grupo

  let subject = groupMetadata.subject || "el grupo";
  let botName = conn.user.name; // Nombre del bot
  let imageUrl = 'https://qu.ax/nxskN.jpg'; // Enlace de la imagen

  let welcomeBot = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢!🥇

  ¡Soy ${botName}, su nuevo asistente digital!
  
  ━━━━━━━━━━━━━━━━━━━
  ⚡ *Mis funciones :*
  ▸ Descargar música/videos
  ▸ Búsquedas en Google
  ▸ Juegos y diversión
  ▸ Generar imágenes con IA
  ▸ Herramientas para Free Fire
  ━━━━━━━━━━━━━━━━━━━
  📂 *Mis menús:*
  ▸ .menu → *Menú general*
  ▸ .menuimg → *Imágenes AI*
  ▸ .menuhot → *Contenido hot*
  ▸ .menuaudios→ *Efectos*
  ▸ .menujuegos → *Juegos grupal*
  ▸ .menufreefire → *Free Fire tools*
  ━━━━━━━━━━━━━━━━━━━
  ©EliteBotGlobal 2023`;

  // Configuración de botones
  const buttons = [
    {
      buttonId: `.menu`, // Comando que se ejecutará
      buttonText: { displayText: 'Hola' }, // Texto del botón
      type: 1, // Tipo de botón
    },
  ];

  // Enviar el mensaje con botones
  try {
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl }, // Enviar imagen
      caption: welcomeBot,      // Mensaje de bienvenida
      buttons: buttons,         // Botones
      footer: "EliteBotGlobal | © 2023", // Pie de página
      headerType: 4,            // Tipo de encabezado (4 = Imagen con texto)
    }, { quoted: m }); // Mensaje citado

    console.log("Mensaje de bienvenida enviado correctamente.");
  } catch (err) {
    console.error("Error al enviar el mensaje con botones:", err);
  }
};

export default handler;
