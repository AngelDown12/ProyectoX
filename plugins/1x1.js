import fetch from 'node-fetch';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const games = new Map();

const handler = async (m, { conn, usedPrefix }) => {
    // Depuración: Ver si el mensaje contiene .adivinaff
    console.log("Mensaje recibido:", m.text);

    const msgText = m.text?.toLowerCase();

    // Si el texto es .adivinaff, proceder a iniciar el juego
    if (msgText?.startsWith(`${usedPrefix}adivinaff`)) {
        console.log("Comando .adivinaff activado");  // Mensaje de depuración

        // Limpiar juego anterior si existe
        if (games.has(m.sender)) {
            clearTimeout(games.get(m.sender).timeout);
            games.delete(m.sender);
        }

        // Obtener nuevo personaje
        const res = await fetch('https://api.vreden.my.id/api/tebakff');
        const { result } = await res.json();
        const { jawaban, img } = result;

        // Guardar juego
        games.set(m.sender, {
            answer: jawaban.toLowerCase(),
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, { 
                    text: `⏰ ¡TIEMPO AGOTADO!\nRespuesta: *${jawaban}*`
                }, { quoted: m });
                games.delete(m.sender);
            }, 30000)
        });

        // Botones para intentar de nuevo
        const buttons = [
            {
                buttonId: "repetir_adivinaff", // ID para el botón "Intentar otro"
                buttonText: { displayText: "🔄 Intentar otro" },
                type: 1
            }
        ];

        // Crear el mensaje con el botón
        const mensaje = generateWAMessageFromContent(m.chat, {
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: { text: `🎮 *ADIVINA EL PERSONAJE DE FREE FIRE* 🎮\n\nTienes *30 segundos* para adivinar.` },
                footer: { text: "Escribe el nombre del personaje" },
                buttons
            })
        });

        // Enviar mensaje
        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    // Ver si se presiona el botón "Intentar otro"
    const response =
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '';

    if (response === 'repetir_adivinaff') {
        console.log("Botón 'Intentar otro' presionado");  // Mensaje de depuración

        // Reenviar el mensaje como si fuera un comando
        await conn.sendMessage(m.chat, { text: `${usedPrefix}adivinaff` });
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

handler.customPrefix = /^\.adivinaff$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
