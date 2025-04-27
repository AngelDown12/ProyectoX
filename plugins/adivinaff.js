import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  conn.tebakff = conn.tebakff || {};
  
  if (conn.tebakff[m.sender]) return conn.reply(m.chat, '❗ Aún tienes una adivinanza pendiente. Responde primero.', m);

  try {
    const res = await fetch('https://api.vreden.my.id/api/tebakff');
    if (!res.ok) throw new Error('API no responde');
    const json = await res.json();
    const { jawaban, img } = json.result;

    conn.tebakff[m.sender] = {
      jawaban: jawaban.toLowerCase(),
      timeout: setTimeout(async () => {
        await conn.sendMessage(m.chat, { 
          text: `⏰ ¡Tiempo agotado!\nLa respuesta era: *${jawaban}*`, 
          footer: '*The Teddies 🐻🔥*',
          buttons: [{ buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "🔁 Intentar otro" }, type: 1 }]
        }, { quoted: m });
        delete conn.tebakff[m.sender];
      }, 30000)
    };

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: `✨ *Adivina el personaje de Free Fire* ✨

Estás viendo a un personaje super conocido...
¿Pero, cuál es su nombre?

⏳ Tienes *30 segundos* para responder.
Escribe tu respuesta en el chat.`,
      footer: "*The Teddies 🐻🔥*",
      buttons: [
        { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "🔁 Intentar otro" }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m });
    
  } catch (e) {
    console.error('Error en tebakff:', e);
    await conn.sendMessage(m.chat, {
      text: "❌ Error al cargar el personaje. Intenta más tarde."
    }, { quoted: m });
  }
};

handler.before = async (m, { conn, usedPrefix, command }) => {
  conn.tebakff = conn.tebakff || {};

  if (!conn.tebakff[m.sender]) return; // No hay partida activa, no hacer nada
  
  if (m.text.startsWith(usedPrefix)) return; // Si es comando, ignorar

  const { jawaban, timeout } = conn.tebakff[m.sender];
  if (m.text.toLowerCase().trim() === jawaban) {
    clearTimeout(timeout);
    delete conn.tebakff[m.sender];
    await conn.sendMessage(m.chat, {
      text: "✅ ¡Correcto! Eres un pro.",
      footer: "*The Teddies 🐻🔥*",
      buttons: [{ buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "🔁 Intentar otro" }, type: 1 }]
    }, { quoted: m });
  } else {
    await conn.sendMessage(m.chat, { text: "❌ Incorrecto, sigue intentando..." }, { quoted: m });
  }
};

handler.help = ["tebakff"];
handler.tags = ["juegos"];
handler.command = /^tebakff|adivinaff$/i;
handler.exp = 20;

export default handler;
