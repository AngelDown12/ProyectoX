let handler = m => m

handler.before = async function (m, { conn, groupMetadata, usedPrefix }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo

  let subject = groupMetadata.subject || "el grupo"
  let botName = conn.user.name
  let imageUrl = 'https://qu.ax/nxskN.jpg'

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
▸ ${usedPrefix}menu → *Menú general*  
▸ ${usedPrefix}menuimg → *Imágenes AI*  
▸ ${usedPrefix}menuhot → *Contenido hot*  
▸ ${usedPrefix}menuaudios → *Efectos*  
▸ ${usedPrefix}menujuegos → *Juegos grupal*  
▸ ${usedPrefix}menufreefire → *Free Fire tools*  
━━━━━━━━━━━━━━━━━━━  
©EliteBotGlobal 2023`

  // Estructura de botón IDÉNTICA a adivinaff
  const buttons = [  
    {  
      buttonId: `${usedPrefix}menufreefire`,  
      buttonText: { displayText: '🎮 Menufreefire' },  
      type: 1  
    }  
  ]  

  // Enviar el mensaje con el mismo diseño + botón
  await conn.sendMessage(m.chat, {  
    image: { url: imageUrl },  
    caption: welcomeBot,  
    footer: "FREE FIRE BATTLEGROUNDS | © GARENA",  
    buttons: buttons,  
    headerType: 4,  
    viewOnce: true  
  }, { quoted: m })  
}

export default handler
