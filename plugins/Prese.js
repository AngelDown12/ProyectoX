let handler = m => m

handler.before = async function (m, { conn, groupMetadata, usedPrefix }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo

  let botName = conn.user.name
  let imageUrl = 'https://qu.ax/nxskN.jpg'

  let welcomeMsg = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢! 🥇\n\n` +
                  `¡Soy ${botName}, su nuevo asistente digital!\n\n` +
                  `━━━━━━━━━━━━━━━━━━━\n` +
                  `⚡ *Mis funciones:*\n` +
                  `▸ Descargar música/videos\n` +
                  `▸ Búsquedas en Google\n` +
                  `▸ Juegos y diversión\n` +
                  `▸ Generar imágenes con IA\n` +
                  `▸ Herramientas para Free Fire\n\n` +
                  `━━━━━━━━━━━━━━━━━━━\n` +
                  `📂 *Mis menus:*\n` +
                  `▸ ${usedPrefix}menu → *Menú general*\n` +
                  `▸ ${usedPrefix}menuimg → *Imágenes AI*\n` +
                  `▸ ${usedPrefix}menuhot → *Contenido hot*\n` +
                  `▸ ${usedPrefix}menuaudios → *Efectos*\n` +
                  `▸ ${usedPrefix}menujuegos → *Juegos grupal*\n` +
                  `▸ ${usedPrefix}menufreefire → *Free Fire tools*\n\n` +
                  `━━━━━━━━━━━━━━━━━━━\n` +
                  `©EliteBotGlobal 2023`

  await conn.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: welcomeMsg,
    footer: "FREE FIRE BATTLEGROUNDS | © GARENA",
    buttons: [
      { buttonId: `${usedPrefix}menufreefire`, buttonText: { displayText: '🎮 Menufreefire' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

export default handler
