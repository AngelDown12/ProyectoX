let mutedUsers = new Set()

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return m.reply('Necesito ser admin del grupo.');
    if (!isAdmin) return m.reply('Solo los admins pueden usar este comando.');

    // Extracción INFALIBLE del usuario mencionado
    let user = null;
    
    // 1. Buscar menciones directas (@usuario)
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
    } 
    // 2. Buscar en mensajes citados
    else if (m.quoted) {
        user = m.quoted.sender;
    }
    // 3. Buscar por número de teléfono escrito
    else if (text.match(/\d+/)) {
        user = text.match(/\d+/)[0] + '@s.whatsapp.net';
    }

    if (!user) return m.reply(`Debes mencionar a un usuario o responder a su mensaje.\nEjemplo: ${usedPrefix + command} @usuario`);

    // Detección a prueba de fallos del comando
    const cmd = m.text.trim().split(/\s+/)[0].toLowerCase();
    
    if (cmd === '.mute2' || cmd === 'mute2') {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🔇 USUARIO SILENCIADO\n@${user.split('@')[0]} no puede enviar mensajes`, 
            mentions: [user] 
        }, { quoted: m });
    } 
    else if (cmd === '.unmute2' || cmd === 'unmute2') {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `🔊 USUARIO DESILENCIADO\n@${user.split('@')[0]} puede enviar mensajes nuevamente`, 
            mentions: [user] 
        }, { quoted: m });
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) {
        if (!m.mtype.includes('sticker')) {
            await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.log('Error al borrar mensaje:', e));
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
