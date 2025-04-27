import fetch from 'node-fetch';

const games = new Map();

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // LIMPIAR JUEGO ANTERIOR
        if (games.has(m.sender)) {
            clearTimeout(games.get(m.sender).timeout);
            games.delete(m.sender);
        }

        // OBTENER NUEVO PERSONAJE
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // GUARDAR EL JUEGO
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
                    buttonId: `${usedPrefix}${command}`, // EL ID DEL BOTÓN SERÁ .adivinaff
                    buttonText: { displayText: "🔄 INTENTAR OTRO" },
                    type: 1
                }
            ],
            viewOnce: true
        }, { quoted: m });

    } catch (e) {
        console.error("Error:", e);
        m.reply("❌ Error cargando personaje. Intenta otra vez con: " + usedPrefix + command);
    }
};

// RESPUESTA DE BOTONES
handler.before = async (m, { conn, usedPrefix }) => {
    if (m.message?.buttonsResponseMessage) {
        m.text = m.message.buttonsResponseMessage.selectedButtonId || '';
    }
    if (m.message?.templateButtonReplyMessage) {
        m.text = m.message.templateButtonReplyMessage.selectedId || '';
    }

    // SI EL USUARIO RESPONDE CORRECTAMENTE
    if (m.text.startsWith(usedPrefix)) return; // Si es comando, no chequear respuesta

    if (!games.has(m.sender)) return;

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
