
let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, text, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    // Extracción INFALIBLE del usuario (como en tu plugin 'mirar')
    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    if (!user) throw `❌ *Menciona o responde al usuario*\nEjemplo: *${usedPrefix + command} @usuario*`;

    // Detección del comando (sin regex complejos)
    const isMute = m.text.startsWith('.mute') || m.text.startsWith('mute');
    const isUnmute = m.text.startsWith('.unmute') || m.text.startsWith('unmute');

    if (isMute) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, {
            text: `🔇 *@${user.split('@')[0]} MUTEADO*\n¡Sus mensajes serán borrados!`,
            mentions: [user]
        }, { quoted: m });
    } 
    else if (isUnmute) {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, {
            text: `✅ *@${user.split('@')[0]} DESMUTEADO*\n¡Ya puede enviar mensajes!`,
            mentions: [user]
        }, { quoted: m });
    }
};

// Anti-mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.mtype.includes('sticker')) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.log(e));
    }
};

handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['moderación'];
handler.command = /^(mute|unmute)$/i; // Soporta .mute2 y mute2
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
