const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
    let chat = global.db.data.chats[m.chat], emoji = chat.emojiTag || '┃';
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    const pesan = args.join` `;
    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupName = groupMetadata.subject;
    const countryFlags = {
        '33': '🇫🇷', '63': '🇵🇭', '599': '🇧🇶', '52': '🇲🇽', '57': '🇨🇴', 
        '54': '🇦🇷', '34': '🇪🇸', '55': '🇧🇷', '1': '🇺🇸', '44': '🇬🇧', 
        '91': '🇮🇳', '502': '🇬🇹', '56': '🇨🇱', '51': '🇵🇪', '58': '🇻🇪', 
        '505': '🇳🇮', '593': '🇪🇨', '504': '🇭🇳', '591': '🇧🇴', '53': '🇨🇺', 
        '503': '🇸🇻', '507': '🇵🇦', '595': '🇵🇾'
    };
    const getCountryFlag = (id) => {
        const phoneNumber = id.split('@')[0];
        let phonePrefix = phoneNumber.slice(0, 3);
        if (phoneNumber.startsWith('1')) return '🇺🇸';
        if (!countryFlags[phonePrefix]) phonePrefix = phoneNumber.slice(0, 2);
        return countryFlags[phonePrefix] || '🏳️‍🌈';
    };

    // Base del mensaje (igual que tu versión original)
    let teks = `*╭━* 𝘼𝘾𝙏𝙄𝙑𝙀𝙉𝙎𝙀𝙉 乂\n\n*${groupName}*\n👤 𝙄𝙉𝙏𝙀𝙂𝙍𝘼𝙉𝙏𝙀𝙎: *${participants.length}*\n${pesan}\n`;

    // Menciona solo los primeros 10 miembros
    const primeros10 = participants.slice(0, 10);
    for (const mem of primeros10) {
        teks += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`;
    }

    // Si hay más de 10, añade "Leer más..."
    if (participants.length > 10) {
        teks += `${emoji} ... *[Leer más]*\n`;
    }

    // Pie del mensaje (igual que tu versión original)
    teks += `\n*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝙊𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`;

    // Envía el mensaje (solo menciona a los 10 primeros)
    await conn.sendMessage(m.chat, {
        text: teks,
        mentions: primeros10.map((a) => a.id)
    });
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;
export default handler;
