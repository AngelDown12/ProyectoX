const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
    // Verificación de permisos
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    // Configuración inicial
    const chat = global.db.data.chats[m.chat];
    const emoji = chat.emojiTag || '┃';
    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupName = groupMetadata.subject;
    const memberCount = participants.length;
    const customMessage = args.join(' ') || '';

    // Mapeo de banderas por código de país
    const countryFlags = {
        '33': '🇫🇷', '63': '🇵🇭', '599': '🇧🇶', '52': '🇲🇽', 
        '57': '🇨🇴', '54': '🇦🇷', '34': '🇪🇸', '55': '🇧🇷', 
        '1': '🇺🇸', '44': '🇬🇧', '91': '🇮🇳', '502': '🇬🇹', 
        '56': '🇨🇱', '51': '🇵🇪', '58': '🇻🇪', '505': '🇳🇮', 
        '593': '🇪🇨', '504': '🇭🇳', '591': '🇧🇴', '53': '🇨🇺', 
        '503': '🇸🇻', '507': '🇵🇦', '595': '🇵🇾'
    };

    // Función para obtener bandera según el ID
    const getCountryFlag = (id) => {
        const phoneNumber = id.split('@')[0];
        let phonePrefix = phoneNumber.slice(0, 3);
        
        if (phoneNumber.startsWith('1')) return '🇺🇸';
        if (!countryFlags[phonePrefix]) phonePrefix = phoneNumber.slice(0, 2);
        
        return countryFlags[phonePrefix] || '🏳️‍🌈';
    };

    // Construcción del mensaje con formato
    let message = `╭━━━━ ¡𝗔𝗖𝗧𝗜𝗩𝗘𝗡𝗦𝗘𝗡! 乂 ━━━━╮\n`;
    message += `${emoji} *🏆 GRUPO:* ${groupName}\n`;
    message += `${emoji} *👤 INTEGRANTES:* ${memberCount}\n\n`;
    
    // Agregar mensaje personalizado si existe
    if (customMessage) {
        message += `${emoji} *MENSAJE:* ${customMessage}\n\n`;
    }
    
    // Encabezado de menciones
    message += `${emoji} *MIEMBROS:*\n`;
    
    // Menciones horizontales (agrupadas de 5 en 5 para mejor visualización)
    let mentionsLine = '';
    participants.forEach((mem, index) => {
        const mention = `${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}`;
        mentionsLine += mention + '  ';
        
        // Hacer salto de línea cada 5 menciones
        if ((index + 1) % 5 === 0) {
            message += mentionsLine + '\n';
            mentionsLine = '';
        }
    });
    
    // Agregar las menciones restantes
    if (mentionsLine.trim() !== '') {
        message += mentionsLine + '\n';
    }
    
    // Pie del mensaje
    message += `\n╰━━━ 𝗘𝗟𝗜𝗧𝗘 𝗕𝗢𝗧 𝗚𝗟𝗢𝗕𝗔𝗟 ━━━╯`;

    // Envío del mensaje
    await conn.sendMessage(m.chat, {
        text: message,
        mentions: participants.map(a => a.id)
    });
};

// Configuración del handler
handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagal|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;
