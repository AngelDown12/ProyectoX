let mutedUsers = new Set()

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return m.reply('𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘢 𝘴𝘦𝘳 𝘢𝘥𝘮𝘪𝘯.');
    if (!isAdmin) return m.reply('> �𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘭𝘰 𝘶𝘴𝘢𝘯 𝘢𝘥𝘮𝘪𝘯𝘴.');

    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);

    if (/^\.?mute$/i.test(m.text)) {
        if (!user) return m.reply(`> 𝘔𝘦𝘯𝘤𝘪𝘰𝘯𝘢 𝘰 𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘦 � 𝘶𝘯 𝘶𝘴𝘶𝘢𝘳𝘪𝘰.\n\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} @usuario`);
        
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, {
            text: `🔇 𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘮𝘶𝘵𝘦𝘢𝘥𝘰: @${user.split('@')[0]}`,
            mentions: [user]
        }, { quoted: m });
    }

    if (/^\.?unmute$/i.test(m.text)) {
        if (!user) return m.reply(`> 𝘔𝘦𝘯𝘤𝘪𝘰𝘯𝘢 𝘰 𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘦 𝘢 �𝘯 𝘶𝘴𝘶𝘢𝘳𝘪𝘰.\n\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} @usuario`);
        
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, {
            text: `✔️ 𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘥𝘦𝘴𝘮𝘶𝘵𝘦𝘢𝘥𝘰: @${user.split('@')[0]}`,
            mentions: [user]
        }, { quoted: m });
    }

    if (/^\.?listamuteados$/i.test(m.text)) {
        if (mutedUsers.size === 0) return m.reply('🚫 𝘕𝘰 𝘩𝘢𝘺 𝘶𝘴𝘶𝘢𝘳𝘪𝘰𝘴 𝘮𝘶𝘵𝘦𝘢𝘥𝘰𝘴 𝘦𝘯 𝘦𝘴𝘵𝘦 𝘨𝘳𝘶𝘱𝘰.');
        
        let list = '📜 𝘓𝘪𝘴𝘵𝘢 𝘥𝘦 𝘶𝘴𝘶𝘢𝘳𝘪𝘰𝘴 𝘮𝘶𝘵𝘦𝘢𝘥𝘰𝘴:\n\n';
        let count = 1;
        
        for (let user of mutedUsers) {
            list += `${count++}. @${user.split('@')[0]}\n`;
        }
        
        await conn.sendMessage(m.chat, {
            text: list,
            mentions: [...mutedUsers].map(user => user)
        }, { quoted: m });
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.mtype.includes('sticker')) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (e) {
            console.error('Error al eliminar mensaje:', e)
        }
    }
}

handler.help = ['mute', 'unmute', 'listamuteados'];
handler.tags = ['group'];
handler.customPrefix = /^(\.?)(mute|unmute|listamuteados)$/i;
handler.command = new RegExp; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
