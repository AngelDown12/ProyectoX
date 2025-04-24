const handler = async (m, { conn, usedPrefix, command }) => {
    // Obtener el ID del usuario que ejecuta el comando
    const userJid = m.sender
    
    // Obtener todos los chats del bot (solo como medio para encontrar grupos)
    const allChats = Object.values(conn.chats).filter(chat => 
        chat.id.endsWith('@g.us') && !chat.id.includes('broadcast')
    )
    
    // Array para almacenar los grupos del usuario
    const userGroups = []
    
    // Buscar en qué grupos está el usuario
    for (const group of allChats) {
        try {
            const metadata = await conn.groupMetadata(group.id)
            // Verificar si el usuario está en este grupo
            const userInGroup = metadata.participants.some(p => p.id === userJid)
            if (userInGroup) {
                userGroups.push({
                    id: group.id,
                    subject: metadata.subject,
                    participants: metadata.participants,
                    isAdmin: metadata.participants.find(p => p.id === userJid)?.admin === 'admin' || 
                            metadata.participants.find(p => p.id === userJid)?.admin === 'superadmin'
                })
            }
        } catch (e) {
            console.error(`Error al verificar grupo ${group.id}:`, e)
        }
    }
    
    // Construir el mensaje de respuesta
    let message = `📋 *TUS GRUPOS* 📋\n\n`
    message += `🔹 *Total de grupos:* ${userGroups.length}\n\n`
    
    let adminCount = 0
    let memberCount = 0
    
    // Mostrar cada grupo del usuario
    userGroups.forEach((group, index) => {
        const role = group.isAdmin ? '✅ Admin' : '👤 Miembro'
        if (group.isAdmin) adminCount++
        else memberCount++
        
        message += `▢ *Nombre:* ${group.subject || 'Sin nombre'}\n`
        message += `▢ *Participantes:* ${group.participants.length}\n`
        message += `▢ *Tu rol:* ${role}\n`
        message += `${index < userGroups.length - 1 ? '────────────────\n' : ''}`
    })
    
    // Resumen final
    message += `\n📊 *RESUMEN*\n`
    message += `✅ *Eres admin en:* ${adminCount} grupos\n`
    message += `👤 *Eres miembro en:* ${memberCount} grupos\n`
    
    // Enviar el mensaje
    await conn.sendMessage(m.chat, { 
        text: message, 
        mentions: [userJid] 
    }, { quoted: m })
}

handler.help = ['misgrupos']
handler.tags = ['grupos']
handler.command = /^(misgrupos|grupos|listagrupos)$/i

export default handler
