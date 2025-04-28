let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    // 1. Extracción IRONCLAD del usuario (funciona SIEMPRE)
    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    if (!user) return m.reply(`⚠️ *Menciona o responde a un usuario*\nEjemplo: *${usedPrefix + command} @usuario*`);

    // 2. Detección del comando (respetando tu customPrefix)
    const isMute = /^\.?mute2$/i.test(m.text.split(/\s+/)[0]);
    const isUnmute = /^\.?unmute2$/i.test(m.text.split(/\s+/)[0]);

    if (isMute) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🔇 *@${user.split('@')[0]} muteado* - Sus mensajes serán borrados`, 
            mentions: [user] 
        }, { quoted: m });
    } 
    
    if (isUnmute) {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `✅ *@${user.split('@')[0]} desmuteado* - Ya puede enviar mensajes`, 
            mentions: [user] 
        }, { quoted: m });
    }
}

// Anti-mensajes de usuarios muteados (mejorado)
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !/sticker|image|video/.test(m.mtype)) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.log(e));
    }
}

handler.help = ['mute2 @usuario', 'unmute2 @usuario'];
handler.tags = ['group'];
handler.customPrefix = /^(\.?)(mute2|unmute2)$/i; // 👈 ¡RESPETADO!
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
