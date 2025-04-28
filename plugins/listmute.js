import { mutedUsers } from './mute.js'

let handler = async (m, { conn, isAdmin }) => {
    if (!isAdmin) return m.reply('> Este comando solo lo usan admins.');

    if (mutedUsers.size === 0) return m.reply('🚫 No hay usuarios muteados en este grupo.');
    
    let list = '📜 Lista de usuarios muteados:\n\n';
    let count = 1;
    
    for (let user of mutedUsers) {
        list += `${count++}. @${user.split('@')[0]}\n`;
    }
    
    await conn.sendMessage(m.chat, {
        text: list,
        mentions: [...mutedUsers].map(user => user)
    }, { quoted: m });
}

handler.help = ['listmute'];
handler.tags = ['group'];
handler.customPrefix = /^(\.?)(listmute)$/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;

export default handler;
