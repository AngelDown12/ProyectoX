const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  let chat = global.db.data.chats[m.chat];
  let emoji = chat.emojiTag || '┃';

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const mensajePersonalizado = args.join` `;
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
    let prefix = phoneNumber.slice(0, 3);
    if (phoneNumber.startsWith('1')) return '🇺🇸';
    if (!countryFlags[prefix]) prefix = phoneNumber.slice(0, 2);
    return countryFlags[prefix] || '🏳️‍🌈';
  };

  let texto = `*╭━* 𝘼𝘾𝙏𝙄𝙑𝙀𝙉𝙎𝙀𝙉 乂\n\n`;
  texto += `*${groupName}*\n👤 INTEGRANTES: *${participants.length}*\n${mensajePersonalizado}\n\n`;

  // Insertamos líneas para que WhatsApp oculte el mensaje
  texto += '╭─「 MENSAJE OCULTO 」\n';
  texto += '\n'.repeat(20); // Esto simula el "ver más"
  texto += '╰─「 MENCIONES 」\n\n';

  texto += participants.map(p => `${emoji} ${getCountryFlag(p.id)} @${p.id.split('@')[0]}`).join('\n');

  texto += `\n\n*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝙊𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`;

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: participants.map(p => p.id)
  });
};
