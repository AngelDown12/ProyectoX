import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const res = await fetch('https://api.vreden.my.id/api/tebakff');
    const json = await res.json();
    const { jawaban, img } = json.result;

    conn.tebakff = conn.tebakff || {};
    conn.tebakff[m.sender] = {
      jawaban: jawaban.toLowerCase(),
      timeout: setTimeout(() => {
        m.reply(`⏰ Tiempo agotado...\n❗ La respuesta correcta era: *${jawaban}*`);
        delete conn.tebakff[m.sender];
      }, 30000)
    };

    await conn.sendMessage(m.chat, { react: { text: '🕵️', key: m.key } });

    const buttons = [
      {
        buttonId: `${usedPrefix + command}`,
        buttonText: { displayText: "🔁 Intentar otro" },
        type: 1,
      }
    ];

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: `✨ *Adivina el personaje de Free Fire* ✨

Estás viendo a un personaje super conocido...
¿Pero, cuál es su nombre?

⏳ Tienes *30 segundos* para responder.
Escribe tu respuesta en el chat.`,
      buttons,
      footer: "*The Teddies 🐻🔥*",
      viewOnce: true,
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply("❌ Ocurrió un error al cargar el personaje. Intenta más tarde.");
  }
};

handler.before = async (m, { conn }) => {
  if (conn.tebakff && conn.tebakff[m.sender]) {
    const respuesta = conn.tebakff[m.sender].jawaban;
    if (m.text.toLowerCase().trim() === respuesta) {
      clearTimeout(conn.tebakff[m.sender].timeout);
      delete conn.tebakff[m.sender];
      return m.reply("✅ *¡Respuesta correcta!* Eres un experto FF 🔥");
    } else {
      return m.reply("❌ *No es esa*, intenta otra vez...");
    }
  }
};

handler.help = ["tebakff"];
handler.tags = ["juegos"];
handler.command = /^tebakff|adivinaff$/i;


export default handler;
