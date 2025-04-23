import { createInterface } from 'readline'
import { stdout, stdin } from 'process'

const rl = createInterface({ input: stdin, output: stdout })

let handler = async (m, { conn }) => {
    if (!m.messageStubType || !m.isGroup) return;
    
    let chat = global.db.data.chats[m.chat];
    if (!chat.detect) return;
    
    if (m.messageStubType === 26) {
        let usuario = `@${m.sender.split('@')[0]}`;
        const isOn = m.messageStubParameters[0] === 'on';
        
        let fkontak = {
            "key": {
                "participants":"0@s.whatsapp.net",
                "remoteJid": "status@broadcast",
                "fromMe": false,
                "id": "Halo"
            },
            "message": {
                "contactMessage": {
                    "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            },
            "participant": "0@s.whatsapp.net"
        };

        let texto = isOn ? 
            `*⚠️ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 ⚠️*\n\n*𝙀𝙡 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧 ${usuario} 𝙝𝙖 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙤 𝙚𝙡 𝙢𝙤𝙙𝙤 "𝙎𝙤𝙡𝙤 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧𝙚𝙨"* 🔒\n\n*𝘼𝙝𝙤𝙧𝙖 𝙨𝙤𝙡𝙤 𝙡𝙤𝙨 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧𝙚𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙚𝙣𝙫𝙞𝙖𝙧 𝙢𝙚𝙣𝙨𝙖𝙟𝙚𝙨 𝙖𝙡 𝙜𝙧𝙪𝙥𝙤.*` :
            `*⚠️ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 ⚠️*\n\n*𝙀𝙡 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧 ${usuario} 𝙝𝙖 𝙙𝙚𝙨𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙤 𝙚𝙡 𝙢𝙤𝙙𝙤 "𝙎𝙤𝙡𝙤 𝙖𝙙𝙢𝙞𝙣𝙞𝙨𝙩𝙧𝙖𝙙𝙤𝙧𝙚𝙨"* 🔓\n\n*𝘼𝙝𝙤𝙧𝙖 𝙩𝙤𝙙𝙤𝙨 𝙡𝙤𝙨 𝙥𝙖𝙧𝙩𝙞𝙘𝙞𝙥𝙖𝙣𝙩𝙚𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙚𝙣𝙫𝙞𝙖𝙧 𝙢𝙚𝙣𝙨𝙖𝙟𝙚𝙨 𝙖𝙡 𝙜𝙧𝙪𝙥𝙤.*`;

        await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: fkontak });
        
        console.log(`\n[GROUP_CHANGE_ANNOUNCE]\nGroup: ${m.chat}\nAdmin: ${m.sender}\nMode: ${isOn ? 'ON' : 'OFF'}\n`);
    }
}

handler.help = ['Detector de cambios en el grupo']
handler.tags = ['group']
handler.group = true

export default handler 
