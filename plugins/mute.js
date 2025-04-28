let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    // Extracción IRONCLAD del usuario (como en tu plugin 'mirar')
    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    if (!user) throw `❌ *Menciona o responde al usuario*\nEjemplo: *${usedPrefix + command} @usuario*`;

    // Detección del comando (respetando TU customPrefix)
    const cmd = m.text.trim().split(/\s+/)[0].toLowerCase();
    const isMute = cmd === '.mute2' || cmd === 'mute2';
    const isUnmute = cmd === '.unmute2' || cmd === 'unmute2';

    if (isMute) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, {
            text: `🔇 *@${user.split('@')[0]} MUTEADO*\n¡Sus mensajes serán borrados!`,
            mentions: [user]
        }, { quoted: m });
        await m.react('🚫');
    } 
    else if (isUnmute) {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, {
            text: `✅ *@${user.split('@')[0]} DESMUTEADO*\n¡Ya puede enviar mensajes!`,
            mentions: [user]
        }, { quoted: m });
        await m.react('👌');
    }
};

// Anti-mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.mtype.includes('sticker')) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.log(e));
    }
};

handler.help = ['mute2 @usuario', 'unmute2 @usuario'];
handler.tags = ['moderación'];
handler.customPrefix = /^(\.?)(mute2|unmute2)$/i; // ✅ ¡TU customPrefix!
handler.command = new RegExp; // Soporta .mute2 y mute2
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
