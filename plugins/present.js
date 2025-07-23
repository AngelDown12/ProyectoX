let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación del grupo o bot agregado

  let subject = groupMetadata?.subject || "este grupo"
  let botName = conn.user?.name || "el bot"

  let welcomeBot = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢!🥇  
¡Soy ${botName}, su nuevo asistente digital!  
━━━━━━━━━━━━━━━━━━━  
⚡ *Mis funciones :*  
▸  Descargar música/videos  
▸  Búsquedas en Google  
▸  Juegos y diversión  
▸  Generar imágenes con IA  
▸  Herramientas para Free Fire  
━━━━━━━━━━━━━━━━━━━  
📂 *Mis menús:*  
▸  .menu → *Menú general*  
▸  .menuimg → *Imágenes AI*  
▸  .menuhot → *Contenido hot*  
▸  .menuaudios → *Efectos*  
▸  .menujuegos → *Juegos grupales*  
▸  .menufreefire → *Free Fire tools*  
━━━━━━━━━━━━━━━━━━━  
©𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡 2025`

  await conn.sendMessage(m.chat, {
    text: welcomeBot
  }, { quoted: m })
}

export default handler
