let handler = m => m

handler.before = async function (m, { conn, groupMetadata, usedPrefix }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo

  let subject = groupMetadata.subject || "el grupo"
  let botName = conn.user.name // Obtiene el nombre de la cuenta del bot
  let imageUrl = 'https://qu.ax/nxskN.jpg' // Imagen de bienvenida

  let welcomeBot = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢! 🥇

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
▸ ${usedPrefix}menu → Menú general
▸ ${usedPrefix}menuimg → Imágenes AI
▸ ${usedPrefix}menuhot → Contenido hot
▸ ${usedPrefix}menuaudios → Efectos
▸ ${usedPrefix}menujuegos → Juegos grupales
▸ ${usedPrefix}menufreefire → Free Fire tools
━━━━━━━━━━━━━━━━━━━
©EliteBotGlobal 2023`

  // Crear el mensaje con botón
  const buttonMessage = {
    image: { url: imageUrl },
    caption: welcomeBot,
    footer: "Presiona el botón para acceder a las herramientas Free Fire",
    buttons: [
      { buttonId: `${usedPrefix}menufreefire`, buttonText: { displayText: '🎮 Menufreefire' }, type: 1 }
    ],
    headerType: 4
  }

  // Enviar el mensaje con imagen y botón
  await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
}

export default handler
