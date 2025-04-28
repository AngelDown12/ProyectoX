let mutedUsers = new Set();

let handler = async (m, { conn }) => {
    if (mutedUsers.size === 0) {
        return conn.reply(m.chat, '> 𝘕𝘰 𝘩𝘢𝘺 𝘶𝘴𝘶𝘢𝘳𝘪𝘰𝘴 𝘮𝘶𝘵𝘦𝘢𝘥𝘰𝘴 𝘢𝘤𝘵𝘶𝘢𝘭𝘮𝘦𝘯𝘵𝘦.', m);
    }

    let list = [...mutedUsers].map((u, idx) => `${idx + 1}. @${u.split('@')[0]}`).join('\n');

    await conn.sendMessage(m.chat, {
        text: `> 𝘓𝘪𝘴𝘵𝘢 𝘥𝘦 𝘶𝘴𝘶𝘢𝘳𝘪𝘰𝘴 𝘮𝘶𝘵𝘦𝘢𝘥𝘰𝘴:\n\n${list}`,
        mentions: [...mutedUsers]
    }, { quoted: m });
};

handler.help = ['listamuteados'];
handler.tags = ['group'];
handler.command = /^listamuteados$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export { handler, mutedUsers };
