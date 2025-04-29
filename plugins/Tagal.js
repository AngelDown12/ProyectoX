const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  let chat = global.db.data.chats[m.chat],
      emoji = chat.emojiTag || '┃';

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const invis = String.fromCharCode(8206).repeat(4001); // Leer más

  const pesan = args.join` `,
        groupMetadata = await conn.groupMetadata(m.chat),
        groupName = groupMetadata.subject;

  const countryFlags = { // <<<< ESTO NO LO BORRES
    '1': '🇺🇸', '7': '🇷🇺', '20': '🇪🇬', '27': '🇿🇦', '30': '🇬🇷', '31': '🇳🇱', '32': '🇧🇪', '33': '🇫🇷',
    '34': '🇪🇸', '36': '🇭🇺', '39': '🇮🇹', '40': '🇷🇴', '41': '🇨🇭', '43': '🇦🇹', '44': '🇬🇧', '45': '🇩🇰',
    // ... (todo tu objeto de códigos que pasaste)
    '998': '🇺🇿'
  };

  const getCountryFlag = (id) => {
    const phoneNumber = id.split('@')[0];
    for (let length = 3; length >= 1; length--) {
      const prefix = phoneNumber.slice(0, length);
      if (countryFlags[prefix]) return countryFlags[prefix];
    }
    return '🏳️‍🌈'; // Default si no se encuentra
  };

  let teks = `*╭━* 𝘼𝘾𝙏𝙄𝙑𝙀𝙉𝙎𝙀𝙉 乂\n\n*${groupName}*\n👤 𝙄𝙉𝙏𝙀𝙂𝙍𝘼𝙉𝙏𝙀𝙎: *${participants.length}*\n${pesan}\n${invis}`;

  for (const mem of participants) {
    teks += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`;
  }

  teks += `\n*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝘖𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`;

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: participants.map((a) => a.id)
  });
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagal|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;
