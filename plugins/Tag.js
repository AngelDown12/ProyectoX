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
        '33': '🇫🇷', '63': '🇵🇭', '52': '🇲🇽', '57': '🇨🇴', '54': '🇦🇷', 
        '34': '🇪🇸', '55': '🇧🇷', '1': '🇺🇸', '44': '🇬🇧', '51': '🇵🇪'
    };
    const getCountryFlag = (id) => {
        const phoneNumber = id.split('@')[0];
        let phonePrefix = phoneNumber.slice(0, 3);
        if (phoneNumber.startsWith('1')) return '🇺🇸';
        if (!countryFlags[phonePrefix]) phonePrefix = phoneNumber.slice(0, 2);
        return countryFlags[phonePrefix] || '🏳️‍🌈';
    };

    // 🔥 MENSAJE ÚNICO CON TODOS LOS MIEMBROS
    let teks = `*╭━* 𝘼𝘾𝙏𝙄𝙑𝙀𝙉𝙎𝙀𝙉 乂\n\n*${groupName}*\n👤 𝙄𝙉𝙏𝙀𝙂𝙍𝘼𝙉𝙏𝙀𝙎: *${participants.length}*\n${pesan}\n`;

    // Etiqueta a TODOS los miembros en un solo bloque
    for (const mem of participants) {
        teks += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`;
    }

    teks += `\n*╰━* 𝙀𝙇𝙄𝙏𝙀𝘽𝙊𝙏𝙂𝙇𝙊𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`;

    await conn.sendMessage(m.chat, { 
        text: teks, 
        mentions: participants.map(a => a.id) 
    });
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagal|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;
export default handler;
