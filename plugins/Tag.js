const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
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

    // Mapeo optimizado de banderas
    const countryFlags = {
        '1': '🇺🇸', '33': '🇫🇷', '34': '🇪🇸', '44': '🇬🇧',
        '52': '🇲🇽', '53': '🇨🇺', '54': '🇦🇷', '55': '🇧🇷',
        '56': '🇨🇱', '57': '🇨🇴', '58': '🇻🇪', '591': '🇧🇴',
        '502': '🇬🇹', '503': '🇸🇻', '504': '🇭🇳', '505': '🇳🇮',
        '506': '🇨🇷', '507': '🇵🇦', '51': '🇵🇪', '593': '🇪🇨',
        '595': '🇵🇾', '598': '🇺🇾', '63': '🇵🇭', '91': '🇮🇳'
    };

    // Función optimizada para obtener bandera
    const getCountryFlag = (id) => {
        const num = id.split('@')[0];
        return countryFlags[num.slice(0, num.startsWith('1') ? 1 : (countryFlags[num.slice(0, 3)] ? 3 : 2))] || '🏳️‍🌈';
    };

    // Construcción del mensaje (formato original conservado)
    let message = `╭━━━━ ¡𝗔𝗖𝗧𝗜𝗩𝗘𝗡𝗦𝗘𝗡! 乂 ━━━━╮\n`;
    message += `${emoji} *🏆 GRUPO:* ${groupName}\n`;
    message += `${emoji} *👤 INTEGRANTES:* ${memberCount}\n\n`;
    
    if (customMessage) message += `${emoji} *MENSAJE:* ${customMessage}\n\n`;
    
    message += `${emoji} *MIEMBROS:*\n`;
    
    // Menciones perfectamente alineadas (4 por línea)
    const membersPerLine = 4;
    for (let i = 0; i < participants.length; i += membersPerLine) {
        const lineMembers = participants.slice(i, i + membersPerLine);
        const line = lineMembers.map(mem => 
            `${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}`
        ).join('  ');
        message += line + '\n';
    }
    
    message += `\n╰━━━ 𝗘𝗟𝗜𝗧𝗘 𝗕𝗢𝗧 𝗚𝗟𝗢𝗕𝗔𝗟 ━━━╯`;

    await conn.sendMessage(m.chat, {
        text: message,
        mentions: participants.map(a => a.id)
    });
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagal|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;
