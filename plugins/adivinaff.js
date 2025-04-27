import fetch from 'node-fetch';

const games = new Map(); // Almacena los juegos activos

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // 1. Limpiar juego anterior SI existe
        if (games.has(m.sender)) {
            clearTimeout(games.get(m.sender).timeout);
            games.delete(m.sender);
        }

        // 2. Obtener nuevo personaje
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // 3. Configurar nuevo juego
        games.set(m.sender, {
            answer: jawaban.toLowerCase(),
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, { 
                    text: `⏰ ¡Se acabó el tiempo!\nLa respuesta era: *${jawaban}*` 
                }, { quoted: m });
                games.delete(m.sender);
            }, 30000)
        });

        // 4. Enviar el mensaje con el diseño ORIGINAL
        await conn.sendMessage(m.chat, {
            image: { url: img },
            caption: `✨ *ADIVINA EL PERSONAJE FREE FIRE* ✨\n\n¿Quién es este personaje?\nTienes *30 segundos* para adivinar.`,
            footer: "Responde con el nombre exacto",
            buttons: [{ 
                buttonId: `${usedPrefix}${command}.new`,
                buttonText: { displayText: "🔁 INTENTAR OTRO" },
                type: 1 
            }],
            viewOnce: true
        }, { quoted: m });

    } catch (e) {
        console.error("Error en el juego:", e);
        m.reply("❌ Ocurrió un error, intenta más tarde");
    }
};

// MANEJADOR DE BOTONES (FUNCIONA SEGURO)
export async function button(m, { conn }) {
    if (m.text === '🔁 INTENTAR OTRO') {
        const cmd = m.quoted?.text?.match(/^\/(tebakff|adivinaff)/i)?.[0] || '/tebakff';
        await handler(m, { 
            conn, 
            usedPrefix: '/', 
            command: cmd.replace('/', '') 
        });
    }
}

// MANEJADOR DE RESPUESTAS
handler.before = async (m, { conn }) => {
    if (!m.text || games.has(m.sender) === false) return;

    const game = games.get(m.sender);
    if (m.text.toLowerCase().trim() === game.answer) {
        clearTimeout(game.timeout);
        games.delete(m.sender);
        m.reply("🎉 ¡CORRECTO! ¡Eres un experto en Free Fire!");
    }
};

handler.help = ['tebakff'];
handler.tags = ['juegos'];
handler.command = /^(tebakff|adivinaff)$/i;
handler.exp = 15;

export default handler;
