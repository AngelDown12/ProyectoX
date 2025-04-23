import { WAMessageStubType } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    if (!m.messageStubType || !m.isGroup) return;
    
    let chat = global.db.data.chats[m.chat];
    if (!chat?.detect) return;
    
    if (m.messageStubType === 26) {
        let usuario = `@${m.sender.split('@')[0]}`;
        let isOn = m.messageStubParameters[0] === 'on';
        
        let text = isOn ? 
            `*⚠️ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 ⚠️*\n\n*𝙀𝙡 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧 ${usuario} 𝙝𝙖 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙤 𝙚𝙡 𝙢𝙤𝙙𝙤 "𝙎𝙤𝙡𝙤 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧𝙚𝙨"* 🔒\n\n*𝘼𝙝𝙤𝙧𝙖 𝙨𝙤𝙡𝙤 𝙡𝙤𝙨 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧𝙚𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙚𝙣𝙫𝙞𝙖𝙧 𝙢𝙚𝙣𝙨𝙖𝙟𝙚𝙨 𝙖𝙡 𝙜𝙧𝙪𝙥𝙤.*` :
            `*⚠️ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 ⚠️*\n\n*𝙀𝙡 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧 ${usuario} 𝙝𝙖 𝙙𝙚𝙨𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙤 𝙚𝙡 𝙢𝙤𝙙𝙤 "𝙎𝙤𝙡𝙤 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧𝙚𝙨"* 🔓\n\n*𝘼𝙝𝙤𝙧𝙖 𝙩𝙤𝙙𝙤𝙨 𝙡𝙤𝙨 𝙥𝙖𝙧𝙩𝙞𝙘𝙞𝙥𝙖𝙣𝙩𝙚𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙚𝙣𝙫𝙞𝙖𝙧 𝙢𝙚𝙣𝙨𝙖𝙟𝙚𝙨 𝙖𝙡 𝙜𝙧𝙪𝙥𝙤.*`;

        let fkontak = {
            key: {
                participants: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                fromMe: false,
                id: "Halo"
            },
            message: {
                contactMessage: {
                    displayName: "𝙂𝙧𝙪𝙥𝙤 𝙈𝙤𝙙𝙞𝙛𝙞𝙘𝙖𝙙𝙤",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${usuario}\nFN:${usuario}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`
                }
            },
            participant: "0@s.whatsapp.net"
        };

        try {
            await conn.sendMessage(m.chat, { 
                text: text,
                mentions: [m.sender]
            }, {
                quoted: fkontak,
                ephemeralExpiration: 86400
            });
            console.log(`[GROUP] Announce mode ${isOn ? 'enabled' : 'disabled'} in ${m.chat} by ${m.sender}`);
        } catch (error) {
            console.error('[ERROR] Failed to send message:', error);
        }
    }
}

handler.group = true;
handler.before = true;

export default handler; 
