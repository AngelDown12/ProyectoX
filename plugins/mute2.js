let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return m.reply('𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘰 𝘴𝘦𝘳 𝘢𝘥𝘮𝘪𝘯 𝘦𝘯 𝘦𝘭 𝘨𝘳𝘶𝘱𝘰.');
    if (!isAdmin) return m.reply('> 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘦𝘴 𝘱𝘢𝘳𝘢 𝘢𝘥𝘮𝘪𝘯𝘴.');

    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);

    if (!user) {
        return m.reply(`> 𝘋𝘦𝘣𝘦𝘴 𝘮𝘦𝘯𝘤𝘪𝘰𝘯𝘢𝘳 𝘰 𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘦𝘳 𝘶𝘯 𝘮𝘦𝘯𝘴𝘢𝘫𝘦.\n\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix}${command} @usuario`);
    }

    if (command.toLowerCase() === 'mute2') {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, {
            text: `🔇 𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘮𝘶𝘵𝘦𝘢𝘥𝘰: @${user.split('@')[0]}`,
            mentions: [user]
        }, { quoted: m });
    } else if (command.toLowerCase() === 'unmute2') {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, {
            text: `✔️ 𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘥𝘦𝘴𝘮𝘶𝘵𝘦𝘢𝘥𝘰: @${user.split('@')[0]}`,
            mentions: [user]
        }, { quoted: m });
    }
};

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.mtype.includes('sticker')) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (e) {
            console.error('Error al eliminar mensaje:', e);
        }
    }
};

handler.help = ['mute2', 'unmute2'];
handler.tags = ['group'];
handler.customPrefix = /^(\.?)(mute2|unmute2)$/i;
handler.command = new RegExp;

handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
