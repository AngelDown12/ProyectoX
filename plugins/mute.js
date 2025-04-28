let mutedUsers = new Set()

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    if (!isBotAdmin) return m.reply('𝘕𝘦𝘤𝘦𝘴𝘪𝘵𝘢 𝘴𝘦𝘳 𝘢𝘥𝘮𝘪𝘯.');
    if (!isAdmin) return m.reply('> 𝘌𝘴𝘵𝘦 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘴𝘰𝘭𝘰 𝘭𝘰 𝘶𝘴𝘢𝘯 𝘢𝘥𝘮𝘪𝘯𝘴.');

    // Extracción mejorada del usuario (menciones + respuestas)
    let user = m.mentionedJid?.[0] || (m.quoted?.sender || text.match(/(\d+)?/)?.[0] + '@s.whatsapp.net');
    
    if (!user) return m.reply(`❌ 𝘔𝘦𝘯𝘤𝘪𝘰𝘯𝘢 𝘢𝘭 𝘶𝘴𝘶𝘢𝘳𝘪𝘰 𝘰 𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘦 𝘢 𝘴𝘶 𝘮𝘦𝘯𝘴𝘢𝘫𝘦\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} @usuario`);

    // Detección infalible del comando (con o sin punto)
    const isMute = /^\.?mute2$/i.test(m.text.split(' ')[0]);
    const isUnmute = /^\.?unmute2$/i.test(m.text.split(' ')[0]);

    if (isMute) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `🔇 𝘔𝘜𝘛𝘌𝘈𝘋𝘖\n@${user.split('@')[0]} 𝘺𝘢 𝘯𝘰 𝘱𝘶𝘦𝘥𝘦 𝘦𝘯𝘷𝘪𝘢𝘳 𝘮𝘦𝘯𝘴𝘢𝘫𝘦𝘴`, 
            mentions: [user] 
        }, { quoted: m });
    } 
    
    if (isUnmute) {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `🔊 𝘋𝘌𝘚𝘔𝘜𝘛𝘌𝘈𝘋𝘖\n@${user.split('@')[0]} 𝘱𝘶𝘦𝘥𝘦 𝘦𝘯𝘷𝘪𝘢𝘳 𝘮𝘦𝘯𝘴𝘢𝘫𝘦𝘴 𝘯𝘶𝘦𝘷𝘢𝘮𝘦𝘯𝘵𝘦`, 
            mentions: [user] 
        }, { quoted: m });
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.mtype.includes('sticker')) {
        await conn.sendMessage(m.chat, { delete: m.key }).catch(e => console.error(e));
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
