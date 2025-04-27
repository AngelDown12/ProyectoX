import fetch from 'node-fetch';

const games = new Map(); // { sender: { answer, timeout } }

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // SI ES BOTÓN, CONVERTIRLO EN TEXTO
        if (m.message?.buttonsResponseMessage) {
            m.text = m.message.buttonsResponseMessage.selectedButtonId || '';
        }
        if (m.message?.templateButtonReplyMessage) {
            m.text = m.message.templateButtonReplyMessage.selectedId || '';
        }

        // 1. Limpiar juego anterior
        if (games.has(m.sender)) {
            clearTimeout(games.get(m.sender).timeout);
            games.delete(m.sender);
        }

        // 2. Obtener personaje
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // 3. Configurar juego
        games.set(m.sender, {
            answer: jawaban.toLowerCase(),
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, { 
                    text: `⏰ ¡TIEMPO AGOTADO!\nRespuesta: *${jawaban}*` 
                }, { quoted: m });
                games.delete(m.sender);
            }, 30000)
        });

        // 4. Enviar mensaje con botón
        await conn.sendMessage(m.chat, {
            image: { url: img },
            caption: `🎮 *ADIVINA EL PERSONAJE FREE FIRE* 🎮\n\nTienes *30 segundos* para adivinar.`,
            footer: "Escribe el nombre del personaje",
            templateButtons: [
                { 
                    quickReplyButton: { 
                        displayText: "🔄 INTENTAR OTRO", 
                        id: `${usedPrefix}${command}` 
                    } 
                }
            ],
            viewOnce: true
        }, { quoted: m });

    } catch (e) {
        console.error("Error:", e);
        m.reply("❌ Error cargando personaje. Intenta con: " + usedPrefix + command);
    }
};

// MANEJADOR DE RESPUESTAS
handler.before = async (m, { conn, usedPrefix }) => {
    // SI ES BOTÓN, CONVERTIRLO EN TEXTO
    if (m.message?.buttonsResponseMessage) {
        m.text = m.message.buttonsResponseMessage.selectedButtonId || '';
    }
    if (m.message?.templateButtonReplyMessage) {
        m.text = m.message.templateButtonReplyMessage.selectedId || '';
    }

    // Ignorar si es comando o no hay juego
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
