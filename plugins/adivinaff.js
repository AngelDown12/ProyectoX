import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Limpiar timeout anterior si existe
    if (conn.tebakff?.[m.sender]) {
      clearTimeout(conn.tebakff[m.sender].timeout);
      delete conn.tebakff[m.sender];
    }

    const res = await fetch('https://api.vreden.my.id/api/tebakff');
    if (!res.ok) throw new Error('API no responde');
    const json = await res.json();
    const { jawaban, img } = json.result;

    conn.tebakff = conn.tebakff || {};
    conn.tebakff[m.sender] = {
      jawaban: jawaban.toLowerCase(),
      timeout: setTimeout(() => {
        m.reply(`⏰ ᴛɪᴇɴᴇ ꜱᴇɢᴜɴᴅᴏꜱ ᴀɢᴏᴛᴀᴅᴏ... ❗ ʟᴀ ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴄᴏʀʀᴇᴄᴛᴀ ᴇʀᴀ: *${jawaban}*`);
        delete conn.tebakff[m.sender];
      }, 30000)
    };

    await conn.sendMessage(m.chat, { react: { text: '🕵️', key: m.key } });

    const buttons = [
      {
        buttonId: `${usedPrefix + command}`, // Repite el comando al hacer clic en el botón
        buttonText: { displayText: '🔁 ɪɴᴛᴇɴᴛᴀʀ ᴏᴛʀᴏ' },
        type: 1,
      }
    ];

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: `✨ *ᴀᴅɪᴠɪɴᴀ ᴇʟ ᴘᴇʀꜱᴏɴᴀᴊᴇ ᴅᴇ ꜰʀᴇᴇ ꜰɪʀᴇ* ✨
      
      ᴇꜱᴛᴀꜱ ᴠɪᴇɴᴅᴏ ᴀ ᴜɴ ᴘᴇʀꜱᴏɴᴀᴊᴇ ꜱᴜᴘᴇʀ ᴄᴏɴᴏᴄɪᴅᴏ...
      ᴘᴇʀᴏ, ¿ᴄᴜᴀ́ʟ ᴇꜱ ꜱᴜ ɴᴏᴍʙʀᴇ?
      
      ⏳ ᴛɪᴇɴᴇꜱ *30 ꜱᴇɢᴜɴᴅᴏꜱ* ᴘᴀʀᴀ ʀᴇꜱᴘᴏɴᴅᴇʀ.
      ᴇꜱᴄʀɪʙᴇ ᴛᴜ ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴇɴ ᴇʟ ᴄʜᴀᴛ.`,
      buttons,
      footer: "*The Teddies 🐻🔥*",
      viewOnce: true,
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply("❌ ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ ᴀʟ ᴄᴀʀɢᴀʀ ᴇʟ ᴘᴇʀꜱᴏɴᴀᴊᴇ. ɪɴᴛᴇɴᴛᴀ ᴍᴀ́ꜱ ᴛᴀʀᴅᴇ.");
  }
};

// Manejador específico para el botón
handler.button = async (m, { conn, usedPrefix, command }) => {
  if (m.text === '🔁 ɪɴᴛᴇɴᴛᴀʀ ᴏᴛʀᴏ') {
    await handler(m, { conn, usedPrefix, command });
  }
};

handler.before = async (m, { conn, usedPrefix }) => {
  // Ignorar mensajes que son comandos o clics en botones
  if (m.text.startsWith(usedPrefix) || m.text === '🔁 ɪɴᴛᴇɴᴛᴀʀ ᴏᴛʀᴏ') return;

  if (conn.tebakff?.[m.sender]) {
    const { jawaban, timeout } = conn.tebakff[m.sender];
    const userAnswer = m.text.toLowerCase().trim();
    
    if (userAnswer === jawaban) {
      clearTimeout(timeout);
      delete conn.tebakff[m.sender];
      await conn.sendMessage(m.chat, { 
        text: "✅ *ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴄᴏʀʀᴇᴄᴛᴀ!* ᴇʀᴇꜱ ᴜɴ ᴇxᴘᴇʀᴛᴏ ꜰꜰ 🔥",
        quoted: m
      });
    } else if (userAnswer) {
      await conn.sendMessage(m.chat, { 
        text: "❌ *ɴᴏ ᴇꜱ ᴇꜱᴀ*, ɪɴᴛᴇɴᴛᴀ ᴏᴛʀᴀ ᴠᴇᴢ...",
        quoted: m
      });
    }
  }
};

handler.help = ["tebakff"];
handler.tags = ["juegos"];
handler.command = /^tebakff|adivinaff$/i;
handler.exp = 20;

export default handler;
