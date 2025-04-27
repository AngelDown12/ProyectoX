import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Limpiar timeout anterior si existe
    if (conn.kevinff?.[m.sender]) {
      clearTimeout(conn.kevinff[m.sender].timeout);
      delete conn.kevinff[m.sender];
    }

    const res = await fetch('https://api.vreden.my.id/api/tebakff');
    if (!res.ok) throw new Error('API no responde');
    const json = await res.json();
    const { jawaban, img } = json.result;

    conn.kevinff = conn.kevinff || {};
    conn.kevinff[m.sender] = {
      jawaban: jawaban.toLowerCase(),
      timeout: setTimeout(() => {
        m.reply(`⏰ ᴛɪᴇɴᴇ ꜱᴇɢᴜɴᴅᴏꜱ ᴀɢᴏᴛᴀᴅᴏ... ❗ ʟᴀ ʀᴇꜱᴘᴜᴇꜱᴛᴀ ᴄᴏʀʀᴇᴄᴛᴀ ᴇʀᴀ: *${jawaban}*`);
        delete conn.kevinff[m.sender];
      }, 30000)
    };

    await conn.sendMessage(m.chat, { react: { text: '🕵️', key: m.key } });

    const buttons = [
      {
        buttonId: `${usedPrefix}${command}`, // Usar el prefijo personalizado
        buttonText: { displayText: '🔁 ɪɴᴛᴇɴᴛᴀʀ ᴏᴛʀᴏ' },
        type: 1,
      }
    ];

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: `✨ *ᴀᴅɪᴠɪɴᴀ ᴇʟ ᴘᴇʀꜱᴏɴᴀᴊᴇ ᴅᴇ ꜰʀᴇᴇ ꜰɪʀᴇ* ✨
      
      ᴇꜱᴛᴀꜱ ᴠɪᴇɴᴅᴏ ᴀ ᴜɴ ᴘᴇʀꜱᴏɴᴀᴊᴇ ꜱᴜᴘᴇʀ ᴄᴏɴᴏᴄɪᴅᴏ...
      ᴘᴇʀᴏ, ¿ᴄᴜᴇ́ʟ ᴇꜱ ꜱᴜ ɴᴏᴍʙʀᴇ?
      
      ⏳ ᴛɪᴇɴᴇꜱ *30 ꜱᴇɢᴜɴᴅᴏꜱ* ᴘᴀʀᴀ ʀᴇ꜂ꜱᴘᴏɴᴅᴇʀ.
      ᴇꜱᴄʀɪʙᴇ ᴛᴜ ʀᴇ꜂ꜱᴘᴜᴇꜱᴛᴀ ᴇɴ ᴇʟ ᴄʜᴀᴛ.`,
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
    // Reenvío manual del comando usando el `command` correcto
    await handler(m, { conn, usedPrefix, command });
  }
};

handler.before = async (m, { conn, usedPrefix }) => {
  // Ignorar mensajes que son comandos o clics en botones
  if (m.text.startsWith(usedPrefix) || m.text === '🔁 ɪɴᴛᴇɴᴛᴀʀ ᴏᴛʀᴏ') return;

  if (conn.kevinff?.[m.sender]) {
    const { jawaban, timeout } = conn.kevinff[m.sender];
    const userAnswer = m.text.toLowerCase().trim();
    
    if (userAnswer === jawaban) {
      clearTimeout(timeout);
      delete conn.kevinff[m.sender];
      await conn.sendMessage(m.chat, { 
        text: "✅ *ʀᴇꜱᴘᴜꜱᴇᴛᴀ ᴄᴏʀʀᴇᴄᴛᴀ!* ᴇʀᴇꜱ ᴜɴ ᴇxᴘᴇʀᴛᴏ ꜰꜰ 🔥",
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

// Cambiar el `command` a kevinff sin punto
handler.command = /^kevinff$/i; // El comando ahora es sin el punto
handler.customPrefix = /kevinff/i; // Ahora responde al prefijo "kevinff" sin el punto

handler.help = ["kevinff"];
handler.tags = ["juegos"];
handler.exp = 20;

export default handler;
