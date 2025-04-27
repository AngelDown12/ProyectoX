import fetch from 'node-fetch';

const games = new Map();

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // LIMPIAR SI HAY JUEGO
        if (games.has(m.sender)) {
            clearTimeout(games.get(m.sender).timeout);
            games.delete(m.sender);
        }

        // OBTENER PERSONAJE
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // CONFIGURAR NUEVO JUEGO
        games.set(m.sender, {
            answer: jawaban.toLowerCase(),
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, { 
                    text: `⏰ ¡TIEMPO AGOTADO!\nRespuesta: *${jawaban}*`
                }, { quoted: m });
                games.delete(m.sender);
            }, 30000)
        });

        // ENVIAR IMAGEN + BOTÓN
        await conn.sendMessage(m.chat, {
            image: { url: img },
            caption: `🎮 *ADIVINA EL PERSONAJE FREE FIRE* 🎮\n\nTienes *30 segundos* para adivinar.`,
            footer: "Escribe el nombre del personaje",
            buttons: [
                { 
                    buttonId: 'tryagain', 
                    buttonText: { displayText: "🔄 INTENTAR OTRO" }, 
                    type: 1 
                }
            ],
            viewOnce: true
        }, { quoted: m });

    } catch (e) {
        console.error("Error:", e);
        m.reply("❌ Error cargando personaje. Intenta con: " + usedPrefix + command);
    }
};

// RESPUESTA AL BOTÓN
handler.handleButton = async (m, { conn, buttonId, usedPrefix, command }) => {
    if (buttonId === 'tryagain') {
        await conn.sendMessage(m.chat, { text: `${usedPrefix}${command}` });
    }
};

handler.before = async (m, { conn, usedPrefix }) => {
    if (m.text.startsWith(usedPrefix) || !games.has(m.sender)) return;

    const game = games.get(m.sender);
    if (m.text.toLowerCase().trim() === game.answer) {
        clearTimeout(game.timeout);
        games.delete(m.sender);
        m.reply("✅ ¡CORRECTO! +20 XP");
    }
};

handler.help = ['tebakff'];
handler.tags = ['juegos'];
handler.command = /^(tebakff|adivinaff)$/i;
handler.exp = 20;

export default handler;
