import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  conn.tebakff = conn.tebakff || {};
  
  if (conn.tebakff[m.sender]) {
    clearTimeout(conn.tebakff[m.sender].timeout);
    delete conn.tebakff[m.sender];
  }
  
  try {
    const res = await fetch('https://api.vreden.my.id/api/tebakff');
    if (!res.ok) throw new Error('API no responde');
    const json = await res.json();
    const { jawaban, img } = json.result;

    conn.tebakff[m.sender] = {
      jawaban: jawaban.toLowerCase(),
      timeout: setTimeout(async () => {
        await conn.sendMessage(m.chat, {
          text: `⏰ ¡Se acabó el tiempo!\nLa respuesta era: *${jawaban}*`,
          footer: '*The Teddies 🐻🔥*',
          buttons: [
            { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "🔁 Intentar otro" }, type: 1 }
          ]
        });
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
      headerType: 4,
      viewOnce: true
    });
    
  } catch (e) {
    console.error('Error en tebakff:', e);
    await conn.sendMessage(m.chat, {
      text: "❌ Error al cargar el personaje. Intenta nuevamente más tarde."
    });
  }
};

// Este before solo responde si realmente hay un juego activo
handler.before = async (m, { conn, usedPrefix, command }) => {
  conn.tebakff = conn.tebakff || {};
  
  if (m.text.startsWith(usedPrefix)) return; // Ignorar comandos

  if (conn.tebakff[m.sender]) {
    const { jawaban, timeout } = conn.tebakff[m.sender];

    if (m.text.toLowerCase().trim() === jawaban) {
      clearTimeout(timeout);
      delete conn.tebakff[m.sender];
      await conn.sendMessage(m.chat, {
        text: "✅ *¡Correcto!* ¡Muy bien crack!",
        footer: "*The Teddies 🐻🔥*",
        buttons: [
          { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "🔁 Intentar otro" }, type: 1 }
        ]
      });
    } else {
      await conn.sendMessage(m.chat, {
        text: "❌ Incorrecto, sigue intentando..."
      });
    }
  }
};

handler.help = ["tebakff"];
handler.tags = ["juegos"];
handler.command = /^tebakff$/i;
handler.exp = 20;

export default handler;
