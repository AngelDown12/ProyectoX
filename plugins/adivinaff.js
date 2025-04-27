import fetch from 'node-fetch';

// Objeto para almacenar juegos activos
const games = new Map();

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Limpiar juego anterior si existe
        if (games.has(m.sender)) {
            clearTimeout(games.get(m.sender).timeout);
            games.delete(m.sender);
        }

        // Obtener datos del personaje
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        if (!res.ok) throw new Error('Error en la API');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // Configurar nuevo juego
        const gameData = {
            answer: jawaban.toLowerCase(),
            timeout: setTimeout(() => {
                m.reply(`⌛ Se acabó el tiempo!\nLa respuesta era: *${jawaban}*`);
                games.delete(m.sender);
            }, 30000) // 30 segundos
        };
        games.set(m.sender, gameData);

        // Enviar imagen con botón
        await conn.sendMessage(m.chat, {
            image: { url: img },
            caption: `🎮 *ADIVINA EL PERSONAJE* 🎮\n\nTienes 30 segundos para adivinar...`,
            footer: "Responde con el nombre del personaje",
            buttons: [{ 
                buttonId: `${command}`, 
                buttonText: { displayText: "🔄 NUEVO INTENTO" }, 
                type: 1 
            }],
            headerType: 4
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply("❌ Error al cargar el juego. Intenta nuevamente.");
    }
};

// Manejador de respuestas
handler.before = async (m, { conn }) => {
    if (!games.has(m.sender)) return;
    
    const { answer, timeout } = games.get(m.sender);
    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === answer) {
        clearTimeout(timeout);
        games.delete(m.sender);
        m.reply("🎉 ¡CORRECTO! ¡Has adivinado!");
    }
    // No enviamos mensaje si es incorrecto para evitar spam
};

handler.help = ['tebakff'];
handler.tags = ['games'];
handler.command = /^(tebakff|adivinaff)$/i;

export default handler;
