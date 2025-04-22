import fs from "fs";

let handler = m => m;

handler.all = async function (m) {
    // Solo responder si el mensaje es exactamente "bot" (case insensitive)
    if (!/^bot$/i.test(m.text)) return;
    
    try {
        // Respuestas aleatorias del bot (simplificado)
        const botResponses = [
            "𝘏𝘰𝘭𝘢 𝘲𝘶𝘦𝘳𝘪𝘥𝘰 𝘩𝘶𝘮𝘢𝘯𝘰 𝘦𝘯 𝘲𝘶𝘦́ 𝘱𝘶𝘦𝘥𝘰 𝘢𝘺𝘶𝘥𝘢𝘳?",
            "𝘏𝘰𝘭𝘢, 𝘴𝘰𝘺 𝘌𝘭𝘪𝘵𝘦 𝘉𝘰𝘵 𝘺 𝘦𝘴𝘵𝘰𝘺 𝘢𝘲𝘶𝘪 𝘱𝘢𝘳𝘢 𝘢𝘺𝘶𝘥𝘢𝘳𝘵𝘦.",
            "𝘈𝘲𝘶𝘪 𝘦𝘴𝘵𝘰𝘺 𝘩𝘶𝘮𝘢𝘯𝘰, 𝘲𝘶𝘦 𝘯𝘦𝘤𝘦𝘴𝘪𝘵𝘢𝘴?",
            "𝘌𝘉𝘎 𝘈𝘤𝘵𝘪𝘷𝘰 24/7 ✅",
            "𝘓𝘢𝘭𝘢𝘭𝘢... 𝘚𝘰𝘺 𝘢𝘴𝘪𝘴𝘵𝘦𝘯𝘵𝘦 𝘢𝘳𝘵𝘪𝘧𝘪𝘤𝘪𝘢𝘭 𝘦𝘯 𝘱𝘶𝘦𝘥𝘰 𝘢𝘺𝘶𝘥𝘢𝘳?",
            "𝘌𝘴𝘵𝘰𝘺 𝘢𝘲𝘶𝘪 𝘩𝘶𝘮𝘢𝘯𝘰 👽"
        ];

        // Enviar solo texto sin menciones complejas
        await this.sendMessage(m.chat, { 
            text: pickRandom(botResponses) 
        }, { 
            quoted: m 
        });

    } catch (error) {
        console.error("Error en el comando bot:", error);
        // Opcional: Notificar al usuario del error
        await this.sendMessage(m.chat, { 
            text: "🚫 Ocurrió un error al procesar tu solicitud" 
        }, { 
            quoted: m 
        });
    }
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export default handler;
