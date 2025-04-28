let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    // Detección INFALIBLE del usuario (menciones + respuestas)
    let user = (m.mentions && m.mentions[0]) || 
               (m.quoted ? m.quoted.sender : null);

    if (!user) return m.reply(`🔴 *¡Menciona a alguien o responde a su mensaje!*\nEjemplo: *${usedPrefix + command} @usuario*`);

    // Verificación del comando (respeta tu customPrefix)
    const isMute = /^\.?mute2$/i.test(m.text.split(/\s+/)[0]);
    const isUnmute = /^\.?unmute2$/i.test(m.text.split(/\s+/)[0]);

    if (isMute) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🔇 *@${user.split('@')[0]} MUTEADO*\n¡Sus mensajes serán eliminados!`, 
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
}

// Elimina mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !/sticker|image|video/.test(m.mtype)) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.log(e));
    }
}

handler.help = ['mute2 @usuario', 'unmute2 @usuario'];
handler.tags = ['moderación'];
handler.customPrefix = /^(\.?)(mute2|unmute2)$/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
