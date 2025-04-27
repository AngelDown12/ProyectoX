import fetch from 'node-fetch';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const games = new Map(); // { sender: { answer, timeout } }

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
                    text: `⏰ ¡TIEMPO AGOTADO!\nRespuesta: *${jawaban}*`
                }, { quoted: m });
                games.delete(m.sender);
            }, 30000) // 30 segundos
        });

        // 4. Crear botón que ejecutará el mismo comando
        const buttons = [
            {
                buttonId: `${usedPrefix}${command}`, // Botón para ejecutar el mismo comando
                buttonText: { displayText: "🔄 Intentar otro" },
                type: 1
            }
        ];

        const mensaje = generateWAMessageFromContent(m.chat, {
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: { text: `🎮 *ADIVINA EL PERSONAJE DE FREE FIRE* 🎮\n\nTienes *30 segundos* para adivinar.` },
                footer: { text: "Escribe el nombre del personaje" },
                imageMessage: { url: img }, // Imagen del personaje
                buttons
            })
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});

    } catch (e) {
        console.error("Error:", e);
        m.reply("❌ Error cargando personaje. Intenta con: " + usedPrefix + command);
    }
};

// MANEJADOR DE RESPUESTAS
handler.before = async (m, { conn, usedPrefix }) => {
    const msgText = m.text?.toLowerCase();

    // Si el texto es .adivinaff y hay un juego en curso
    if (games.has(m.sender)) {
        const game = games.get(m.sender);

        // Verificar si el texto es la respuesta correcta
        if (msgText?.trim() === game.answer) {
            clearTimeout(game.timeout);
            games.delete(m.sender);
            await m.reply("✅ ¡CORRECTO! +20 XP");
        }
    }

    // Si el botón 'Intentar otro' fue presionado, volver a ejecutar el comando
    const response =
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '';

    if (response === `${usedPrefix}${command}`) {
        // Llamar de nuevo al mismo comando para reiniciar el juego
        await handler(m, { conn, usedPrefix, command });
    }
};

handler.help = ['adivinaff'];
handler.tags = ['juegos'];
handler.command = /^(adivinaff|tebakff)$/i;
handler.exp = 20;

export default handler;
