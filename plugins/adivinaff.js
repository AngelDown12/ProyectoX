import fetch from 'node-fetch';

// Objeto para almacenar los juegos activos
const activeGames = new Map();

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Limpiar juego anterior si existe
        if (activeGames.has(m.sender)) {
            const { timeout } = activeGames.get(m.sender);
            clearTimeout(timeout);
            activeGames.delete(m.sender);
        }

        // Obtener nuevo personaje
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        if (!res.ok) throw new Error('Error en la API');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // Configurar nuevo juego
        const gameData = {
            jawaban: jawaban.toLowerCase(),
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, {
                    text: `⌛ Tiempo terminado!\nLa respuesta era: *${jawaban}*`
                }, { quoted: m });
                activeGames.delete(m.sender);
            }, 30000)
        };
        activeGames.set(m.sender, gameData);

        // Enviar mensaje con el personaje
        await conn.sendMessage(m.chat, {
            image: { url: img },
            caption: `🎮 *ADIVINA EL PERSONAJE DE FREE FIRE* 🎮\n\nTienes 30 segundos para adivinar...`,
            footer: "Responde con el nombre del personaje",
            buttons: [
                { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "🔄 Intentar otro" }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, {
            text: "❌ Ocurrió un error, por favor intenta más tarde"
        }, { quoted: m });
    }
};

// Manejador para respuestas
handler.before = async (m, { conn, usedPrefix }) => {
    if (!activeGames.has(m.sender) || m.text.startsWith(usedPrefix)) return;

    const { jawaban, timeout } = activeGames.get(m.sender);
    
    if (m.text.toLowerCase().trim() === jawaban) {
        clearTimeout(timeout);
        activeGames.delete(m.sender);
        await conn.sendMessage(m.chat, {
            text: "🎉 ¡Correcto! Has adivinado el personaje",
            quoted: m
        });
    } else {
        await conn.sendMessage(m.chat, {
            text: "❌ Incorrecto, sigue intentando...",
            quoted: m
        });
    }
};

handler.help = ['tebakff'];
handler.tags = ['games'];
handler.command = /^(tebakff|adivinaff)$/i;

export default handler;
