let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    // 1. Extracción INFALIBLE del usuario (menciones o respuestas)
    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    
    if (!user) {
        return m.reply(`🔴 *USO INCORRECTO*\nEjemplo: *${usedPrefix + command} @usuario*`);
    }

    // 2. Detección del comando (respetando tu customPrefix)
    const cmd = m.text.trim().split(/\s+/)[0].toLowerCase(); // Separa el comando del texto

    // 3. Acciones (mute/unmute)
    if (cmd === '.mute2' || cmd === 'mute2') {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🔇 *@${user.split('@')[0]} HA SIDO MUTEADO*`, 
            mentions: [user] 
        }, { quoted: m });
    } 
    else if (cmd === '.unmute2' || cmd === 'unmute2') {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `✅ *@${user.split('@')[0]} HA SIDO DESMUTEADO*`, 
            mentions: [user] 
        }, { quoted: m });
    }
}

// Anti-mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.mtype.includes('sticker')) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.log(e));
    }
}

handler.help = ['mute2 @usuario', 'unmute2 @usuario'];
handler.tags = ['moderación'];
handler.customPrefix = /^(\.?)(mute2|unmute2)$/i; // ✅ Respeta tu prefijo
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
