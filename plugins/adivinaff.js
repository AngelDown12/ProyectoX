import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Limpiar juego anterior
    if (conn.tebakff?.[m.sender]) {
      clearTimeout(conn.tebakff[m.sender].timeout);
      delete conn.tebakff[m.sender];
    }

    // Obtener nuevo personaje
    const res = await fetch('https://api.vreden.my.id/api/tebakff');
    if (!res.ok) throw new Error('Error en la API');
    const { result } = await res.json();
    const { jawaban, img } = result;

    // Configurar nuevo juego
    conn.tebakff = conn.tebakff || {};
    conn.tebakff[m.sender] = {
      jawaban: jawaban.toLowerCase(),
      timeout: setTimeout(() => {
        m.reply(`⏰ Tiempo agotado!\nLa respuesta era: *${jawaban}*`);
        delete conn.tebakff[m.sender];
      }, 30000)
    };

    // Enviar reacción
    await conn.sendMessage(m.chat, { 
      react: { text: '🕵️', key: m.key } 
    });

    // Mensaje con botón (DISEÑO ORIGINAL)
    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: `✨ *Adivina el personaje de Free Fire* ✨

Estás viendo a un personaje super conocido...
¿Pero, cuál es su nombre?

⏳ Tienes *30 segundos* para responder.
Escribe tu respuesta en el chat.`,
      buttons: [
        {
          buttonId: `${usedPrefix}${command}_nuevo`,
          buttonText: { displayText: "🔁 Intentar otro" },
          type: 1
        }
      ],
      footer: "*The Teddies 🐻🔥*",
      viewOnce: true
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("❌ Error al cargar el personaje");
  }
};

// Manejador para el botón "Intentar otro"
handler.button = /^tebakff_nuevo|adivinaff_nuevo$/i;
handler.before = async (m, { conn, usedPrefix }) => {
  // Manejar clic en botón
  if (m.quoted?.text?.includes('Adivina el personaje') && m.text === '🔁 Intentar otro') {
    await handler(m, { conn, usedPrefix, command: m.body.replace('_nuevo', '') });
    return;
  }

  // Manejar respuestas normales
  if (!conn.tebakff?.[m.sender] || m.text.startsWith(usedPrefix)) return;

  const { jawaban, timeout } = conn.tebakff[m.sender];
  if (m.text.toLowerCase().trim() === jawaban) {
    clearTimeout(timeout);
    delete conn.tebakff[m.sender];
    m.reply("✅ ¡Correcto! Eres un experto FF 🔥");
  } else if (m.text) {
    m.reply("❌ No es esa, intenta otra vez...");
  }
};

handler.help = ["tebakff"];
handler.tags = ["juegos"];
handler.command = /^tebakff|adivinaff$/i;
handler.exp = 20;

export default handler;
