const handler = async (m, { conn, usedPrefix, command, isAdmin, isOwner }) => {
    // Obtener todos los chats del usuario
    const chats = await conn.chats.all()
    
    // Filtrar solo grupos (excluyendo chats privados)
    const groups = chats.filter(chat => chat.isGroup)
    
    // Obtener el ID del usuario que ejecuta el comando
    const userJid = m.sender
    
    // Preparar el mensaje
    let message = `📋 *TUS GRUPOS* 📋\n\n`
    message += `🔹 *Total de grupos:* ${groups.length}\n\n`
    
    // Contadores
    let adminCount = 0
    let memberCount = 0
    
    // Procesar cada grupo para obtener detalles
    for (const group of groups) {
        try {
            // Obtener metadatos del grupo
            const metadata = await conn.groupMetadata(group.id)
            // Verificar si el usuario es admin
            const userParticipant = metadata.participants.find(p => p.id === userJid)
            const isUserAdmin = userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin'
            
            if (isUserAdmin) adminCount++
            else memberCount++
            
            message += `▢ *Nombre:* ${metadata.subject}\n`
            message += `▢ *Participantes:* ${metadata.participants.length}\n`
            message += `▢ *Tu rol:* ${isUserAdmin ? '✅ Admin' : '👤 Miembro'}\n`
            message += `────────────────\n`
        } catch (e) {
            console.error(`Error al procesar grupo ${group.id}:`, e)
            message += `▢ *Nombre:* [Error al obtener]\n`
            message += `▢ *Tu rol:* ❓\n`
            message += `────────────────\n`
        }
    }
    
    // Resumen estadístico
    message += `\n📊 *RESUMEN*\n`
    message += `✅ *Eres admin en:* ${adminCount} grupos\n`
    message += `👤 *Eres miembro en:* ${memberCount} grupos\n`
    
    // Enviar el mensaje con los detalles
    await conn.reply(m.chat, message, m, { mentions: [userJid] })
}

// Configuración del handler
handler.help = ['misgrupos']
handler.tags = ['grupos']
handler.command = /^(misgrupos|grupos|listagrupos|misgrupos)$/i

export default handler
