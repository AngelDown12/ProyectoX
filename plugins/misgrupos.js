const handler = async (m, {conn, usedPrefix, command}) => {
    const userJid = m.sender;
    
    // Obtener todos los grupos conocidos por el bot
    const groupList = Object.values(conn.chats).filter(
        chat => chat.id.endsWith('@g.us')
    );
    
    // Verificar grupos donde está el usuario
    const userGroups = [];
    
    for (const group of groupList) {
        try {
            const metadata = await conn.groupMetadata(group.id);
            const isParticipant = metadata.participants.some(
                p => p.id === userJid
            );
            
            if (isParticipant) {
                const isAdmin = metadata.participants.find(
                    p => p.id === userJid
                )?.admin === 'admin' || false;
                
                userGroups.push({
                    name: metadata.subject || 'Sin nombre',
                    id: group.id,
                    isAdmin,
                    participants: metadata.participants.length
                });
            }
        } catch (e) {
            console.error(`Error verificando grupo ${group.id}:`, e);
        }
    }
    
    // Construir mensaje de respuesta
    if (userGroups.length === 0) {
        return conn.reply(m.chat, '❌ No estás en ningún grupo conocido por mí', m);
    }
    
    let message = `*📋 TUS GRUPOS (${userGroups.length})*\n\n`;
    
    userGroups.forEach((group, index) => {
        message += `*🔸 ${group.name}*\n`;
        message += `👥 Miembros: ${group.participants}\n`;
        message += `⚜️ Rol: ${group.isAdmin ? 'Administrador' : 'Miembro'}\n`;
        message += `🆔 ID: ${group.id.replace('@g.us', '')}\n`;
        message += index < userGroups.length - 1 ? '\n─────────────\n' : '';
    });
    
    await conn.sendMessage(m.chat, {
        text: message,
        mentions: [userJid]
    }, {quoted: m});
};

handler.help = ['misgrupos'];
handler.tags = ['grupos'];
handler.command = /^(misgrupos|vergrupos|grupos)$/i;

export default handler;
