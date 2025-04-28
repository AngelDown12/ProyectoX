let mutedUsers = new Set();

let handler = async (m, { conn, command, usedPrefix, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return conn.reply(m.chat, '🚫 El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '🚫 Este comando solo puede usarlo un administrador.', m);

    let user = m.mentionedJid?.[0] ||
               (m.quoted ? m.quoted.sender : null) ||
               (m.text.match(/\d{5,16}@s\.whatsapp\.net/) || [])[0] ||
               (m.text.match(/\d{5,16}/) ? m.text.match(/\d{5,16}/)[0] + '@s.whatsapp.net' : null);

    if (!user) {
        return conn.reply(m.chat, `⚡ Menciona al usuario o responde su mensaje para silenciar/desilenciar.\n\nEjemplo:\n${usedPrefix + command} @usuario`, m);
    }

    if (command.toLowerCase() === 'mute2') {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🔇 Usuario muteado: @${user.split('@')[0]}`,
            mentions: [user]
        }, { quoted: m });
    } else if (command.toLowerCase() === 'unmute2') {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `✅ Usuario desmuteado: @${user.split('@')[0]}`,
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

handler.customPrefix = /^(\.?)(mute2|unmute2)$/i; // <<< Aquí ya soporta punto y sin punto
handler.command = new RegExp; // <<< Para que funcione customPrefix
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.help = ['mute2', 'unmute2'];
handler.tags = ['group'];

export default handler;
