let handler = m => m

handler.before = async function (m, { conn, groupMetadata, usedPrefix }) {
  // Verificar si es un evento de creación de grupo
  if (!m.messageStubType || !m.isGroup || m.messageStubType !== 20) return;

  const botName = conn.user.name;
  const imageUrl = 'https://qu.ax/nxskN.jpg'; // Imagen de bienvenida

  // Texto de bienvenida (MISMO DISEÑO QUE TENÍAS)
  const welcomeMsg = `
🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢! 🥇

¡Soy ${botName}, su nuevo asistente digital!

━━━━━━━━━━━━━━━━━━━
⚡ *Mis funciones:*
▸ Descargar música/videos
▸ Búsquedas en Google
▸ Juegos y diversión
▸ Generar imágenes con IA
▸ Herramientas para Free Fire
━━━━━━━━━━━━━━━━━━━
📂 *Mis menus:*
▸ ${usedPrefix}menu → *Menú general*
▸ ${usedPrefix}menuimg → *Imágenes AI*
▸ ${usedPrefix}menuhot → *Contenido hot*
▸ ${usedPrefix}menuaudios → *Efectos*
▸ ${usedPrefix}menujuegos → *Juegos grupal*
▸ ${usedPrefix}menufreefire → *Free Fire tools*
━━━━━━━━━━━━━━━━━━━
©EliteBotGlobal 2023
`;

  // ENVIAR AL CHAT (NO A CONSOLA)
  await conn.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: welcomeMsg,
    footer: "Presiona el botón para Free Fire →",
    buttons: [
      { buttonId: `${usedPrefix}menufreefire`, buttonText: { displayText: '🎮 Menufreefire' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });

  // Opcional: Mostrar confirmación en consola
  console.log("✅ Mensaje de bienvenida enviado al grupo:", groupMetadata.subject);
}

export default handler;
