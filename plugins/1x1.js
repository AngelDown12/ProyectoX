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

        // 4. Enviar mensaje CON BOTÓN
        const buttons = [
            {
                buttonId: `${usedPrefix}${command}`, // Mismo comando al presionar el botón
                buttonText: { displayText: "🔄 Intentar otro" },
                type: 1
            }
        ];

        const mensaje = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {},
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: {
                            text: `🎮 *ADIVINA EL PERSONAJE FREE FIRE* 🎮\n\nTienes *30 segundos* para adivinar.`
                        },
                        footer: { text: "Escribe el nombre del personaje" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
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

    // Si se presiona un botón con el mismo comando, volver a ejecutar .adivinaff
    const response =
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '';

    if (response === `${usedPrefix}adivinaff`) {
        await handler(m, { conn, usedPrefix, command: 'adivinaff' });  // Llamamos al mismo comando al presionar el botón
        return;
    }

    // Verificar respuesta del juego
    if (games.has(m.sender)) {
        const game = games.get(m.sender);
        if (msgText?.trim() === game.answer) {
            clearTimeout(game.timeout);
            games.delete(m.sender);
            await m.reply("✅ ¡CORRECTO! +20 XP");
        }
    }
};

handler.help = ['adivinaff'];
handler.tags = ['juegos'];
handler.command = /^(adivinaff|tebakff)$/i;
handler.exp = 20;

export default handler;
