let mutedUsers = new Set();
let muteDurations = new Map();
let muteReasons = new Map();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return conn.reply(m.chat, '> 𝘉𝘰𝘭𝘪𝘭𝘭𝘰𝘉𝘰𝘵 𝘯𝘦𝘤𝘦𝘴𝘪𝘵𝘢 𝘴𝘦𝘳 𝘢𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳. 🥖', m);
    if (!isAdmin) return conn.reply(m.chat, '> 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘱𝘶𝘦𝘥𝘦𝘯 𝘶𝘴𝘢𝘳𝘭𝘰 𝘢𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳𝘦𝘴. 🥖', m);

    // Comando para listar usuarios muteados
    if (command === 'listamute' || command === 'muteados') {
        if (mutedUsers.size === 0) return conn.reply(m.chat, '> 𝙉𝙤 𝙝𝙖𝙮 𝙪𝙨𝙪𝙖𝙧𝙞𝙤𝙨 𝙢𝙪𝙩𝙚𝙖𝙙𝙤𝙨 �𝙤𝙧 𝙚𝙡 𝙢𝙤𝙢𝙚𝙣𝙩𝙤. 🥖', m);
        
        let list = '🔇 *𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎 𝙈𝙐𝙏𝙀𝘼𝘿𝙊𝙎* 🔇\n\n';
        let counter = 1;
        
        mutedUsers.forEach(user => {
            const reason = muteReasons.get(user) || '𝙎𝙞𝙣 𝙧𝙖𝙯𝙤́𝙣 𝙚𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘𝙖𝙙𝙖';
            const duration = muteDurations.get(user) ? `\n⏳ 𝙏𝙞𝙚𝙢𝙥𝙤: ${muteDurations.get(user)}` : '';
            list += `${counter}. @${user.split('@')[0]}\n💬 𝙍𝙖𝙯𝙤́𝙣: ${reason}${duration}\n\n`;
            counter++;
        });
        
        return conn.sendMessage(m.chat, { 
            text: list, 
            mentions: [...mutedUsers].map(user => user) 
        }, { quoted: m });
    }

    // Extracción del usuario (para mute/unmute)
    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null) || (text.match(/@(\d+)/)?.[1] + '@s.whatsapp.net');
    if (!user) return conn.reply(m.chat, `> 𝙈𝙚𝙣𝙘𝙞𝙤𝙣𝙖 𝙖𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤 𝙤 𝙧𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖 �𝙪𝙚𝙙𝙚𝙨 𝙢𝙪𝙩𝙚𝙖𝙧.\n\n𝙀𝙟𝙚𝙢𝙥𝙡𝙤: ${usedPrefix + command} @usuario 🥖`, m);

    if (!user.includes('@s.whatsapp.net')) user += '@s.whatsapp.net';

    if (command === "mute") {
        const reason = text.split(' ').slice(2).join(' ') || '𝙎𝙞𝙣 𝙧𝙖𝙯𝙤́𝙣 𝙚𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘𝙖𝙙𝙖';
        mutedUsers.add(user);
        muteReasons.set(user, reason);
        
        // Opcional: mute temporal (ejemplo: 5m)
        if (text.includes('--temp')) {
            const time = text.match(/--temp (\d+)([mh])/);
            if (time) {
                const duration = parseInt(time[1]);
                const unit = time[2];
                const ms = unit === 'm' ? duration * 60000 : duration * 3600000;
                muteDurations.set(user, `${duration}${unit}`);
                setTimeout(() => {
                    mutedUsers.delete(user);
                    muteDurations.delete(user);
                    conn.sendMessage(m.chat, { text: `⏰ 𝙀𝙡 𝙢𝙪𝙩𝙚𝙤 𝙙𝙚 @${user.split('@')[0]} 𝙝𝙖 𝙚𝙭𝙥𝙞𝙧𝙖𝙙𝙤.`, mentions: [user] });
                }, ms);
            }
        }
        
        await conn.sendMessage(m.chat, {
            text: `🔇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙈𝙐𝙏𝙀𝘼𝘿𝙊:\n👤 @${user.split('@')[0]}\n💬 𝙍𝙖𝙯𝙤́𝙣: ${reason}`,
            mentions: [user]
        }, { quoted: m });
        
    } else if (command === "unmute") {
        mutedUsers.delete(user);
        muteReasons.delete(user);
        muteDurations.delete(user);
        await conn.sendMessage(m.chat, {
            text: `🔊 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 �𝘿𝙀𝙎𝙈𝙐𝙏𝙀𝘼𝘿𝙊: @${user.split('@')[0]}`,
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

// Añade los nuevos comandos al help
handler.help = ['mute', 'unmute', 'listamute'];
handler.tags = ['group'];
handler.command = /^(mute|unmute|listamute|muteados)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
