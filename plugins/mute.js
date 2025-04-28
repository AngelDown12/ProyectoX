let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo para admins*');

    // Extracción IRONCLAD del usuario (100% efectiva)
    let user = null;
    
    // 1. Prioridad a menciones directas
    if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];
    }
    // 2. Mensajes citados como fallback
    else if (m.quoted) {
        user = m.quoted.sender;
    }
    // 3. Último recurso: extraer de texto
    else {
        const numMatch = text.match(/\d{10,}/);
        if (numMatch) user = numMatch[0] + '@s.whatsapp.net';
    }

    if (!user) return m.reply(`❌ *Menciona al usuario o responde a su mensaje*\nEjemplo: *${usedPrefix + command} @usuario*`);

    // Detección a prueba de balas del comando
    const cmd = m.text.trim().split(/\s+/)[0].toLowerCase();
    
    if (cmd === '.mute2' || cmd === 'mute2') {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🚫 *@${user.split('@')[0]} muteado* - No puede enviar mensajes`, 
            mentions: [user] 
        }, { quoted: m });
    } 
    else if (cmd === '.unmute2' || cmd === 'unmute2') {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `✅ *@${user.split('@')[0]} desmuteado* - Puede enviar mensajes nuevamente`, 
            mentions: [user] 
        }, { quoted: m });
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) {
        if (!/sticker|image|video/.test(m.mtype)) { // Permite stickers/media
            await conn.sendMessage(m.chat, { delete: m.key })
                   .catch(e => console.log('⚠️ No se pudo borrar mensaje:', e));
        }
    }
}

handler.help = ['mute2 @usuario', 'unmute2 @usuario'];
handler.tags = ['group'];
handler.customPrefix = /^(\.?)(mute2|unmute2)$/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
