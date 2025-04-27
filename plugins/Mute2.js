let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return conn.reply(m.chat, '> 𝘉𝘰𝘭𝘪𝘭𝘭𝘰𝘉𝘰𝘵 𝘯𝘦𝘤𝘦𝘴𝘪𝘵𝘢 𝘴𝘦𝘳 𝘢𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳. 🥖', m);
    if (!isAdmin) return conn.reply(m.chat, '> 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘱𝘶𝘦𝘥𝘦𝘯 𝘶𝘴𝘢𝘳𝘭𝘰 𝘢𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳𝘦𝘴. 🥖', m);

    // Extracción mejorada del usuario
    let user = m.mentionedJid?.[0] || 
               (m.quoted ? m.quoted.sender : null) || 
               (m.text.match(/@(\d+)/)?.[1] + '@s.whatsapp.net');

    if (!user) {
        return conn.reply(m.chat, `> 𝘔𝘦𝘯𝘤𝘪𝘰𝘯𝘢 𝘢𝘭 𝘶𝘴𝘶𝘢𝘳𝘪𝘰 𝘰 𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘦 𝘢 𝘴𝘶 𝘮𝘦𝘯𝘴𝘢𝘫𝘦 𝘱𝘢𝘳𝘢 𝘮𝘶𝘵𝘦𝘢𝘳.\n\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} @usuario 🥖`, m);
    }

    // Verificación adicional del usuario
    if (!user.includes('@s.whatsapp.net')) {
        user = user + '@s.whatsapp.net';
    }

    if (command === "mute") {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, {
            text: `𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘮𝘶𝘵𝘦𝘢𝘥𝘰: @${user.split('@')[0]}  🥖`,
            mentions: [user]
        }, { quoted: m });
    } else if (command === "unmute") {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, {
            text: `𝘜𝘴𝘶𝘢𝘳𝘪𝘰 𝘥𝘦𝘴𝘮𝘶𝘵𝘦𝘢𝘥𝘰: @${user.split('@')[0]}  🥖`,
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

handler.help = ['mute', 'unmute'];
handler.tags = ['group'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
