import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listasGrupos = new Map();
let mensajesGrupos = new Map(); 
let parejasConfirmadas = new Map(); // Mapa de parejas (grupo -> [ [user1, user2] ])

let handler = async (m, { conn }) => {
    const msgText = m.text?.toLowerCase();
    const groupId = m.chat;

    // Detectar respuesta de botones
    const response = 
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        msgText || '';

    // COMANDO TERMINAR (Cuando el amor se acaba 💔)
    if (response === 'terminar') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        const pareja = parejas.find(p => p.includes(m.sender));

        if (pareja) {
            const nuevasParejas = parejas.filter(p => !p.includes(m.sender));
            parejasConfirmadas.set(groupId, nuevasParejas);
            
            await conn.sendMessage(m.chat, { 
                text: `💔 *SE ACABÓ EL AMOR* 💔\n\n"${await conn.getName(pareja[0])} ❌ ${await conn.getName(pareja[1])}"\n\n*¡Uno de ustedes rompió el corazón del otro!*\n\n🔫 *Ahora vuelvan a ser solo amigos (o enemigos en Free Fire).*`, 
                mentions: pareja 
            });
        } else {
            await conn.sendMessage(m.chat, { 
                text: `🤡 *¿QUÉ INTENTAS TERMINAR SI NI PAREJA TIENES?*\n\n*Primero consigue un novio/a, mi rey/reina.* 😂💔` 
            });
        }
        return;
    }

    // ACEPTAR / RECHAZAR (El drama del amor)
    if (response === 'aceptar' || response === 'rechazar') {
        const mensajeGuardado = mensajesGrupos.get(groupId);
        if (!mensajeGuardado || m.sender !== mensajeGuardado.propuesto) {
            await conn.sendMessage(m.chat, { 
                text: `🚨 *ESTA DECLARACIÓN NO ES PARA TI, SAPO* 🚨\n\n*No te hagas el interesante, nadie te quiere.* 😂` 
            });
            return;
        }

        const proponente = mensajeGuardado.proponente;
        const propuesto = mensajeGuardado.propuesto;

        if (response === 'aceptar') {
            if (!parejasConfirmadas.has(groupId)) parejasConfirmadas.set(groupId, []);
            parejasConfirmadas.get(groupId).push([proponente, propuesto]);

            const buttons = [
                { buttonId: 'terminar', buttonText: { displayText: 'TERMINAR 💔' } },
                { buttonId: 'parejas', buttonText: { displayText: 'VER PAREJAS 💑' } }
            ];

            await conn.sendMessage(m.chat, { 
                text: `🔥 *¡NUEVA PAREJA EN EL GRUPO!* 🔥\n\n💌 *${await conn.getName(proponente)} + ${await conn.getName(propuesto)}*\n\n*"El amor es como un headshot... te llega cuando menos lo esperas."* 💘\n\n*¿Cuánto durarán?* 😏`, 
                mentions: [proponente, propuesto],
                footer: "💖 Usa .terminar si se aburren",
                buttons: buttons,
                headerType: 1
            });
        } else {
            await conn.sendMessage(m.chat, { 
                text: `💀 *¡RECHAZADO/A!* 💀\n\n*${await conn.getName(propuesto)} dijo:*\n\n*"Mejor juega Free Fire, ahí sí tienes kills."* 😂\n\n*${await conn.getName(proponente)}, sigue intentando... o no.* 🚶‍♂️💔`, 
                mentions: [proponente, propuesto] 
            });
        }
        mensajesGrupos.delete(groupId);
        return;
    }

    // COMANDO .SERNOVIOS (El inicio del drama)
    if (msgText.startsWith('.sernovios')) {
        const mencionado = m.mentionedJid?.[0];
        if (!mencionado) return conn.sendMessage(m.chat, { text: `*MENCIONA A ALGUIEN, SAPO.*\n*Ejemplo:* .sernovios @usuario` });

        if (mencionado === m.sender) return conn.sendMessage(m.chat, { text: `*¿QUIERES SER TU PROPIO NOVIO?* 😂\n*Eso se llama autoestima, no amor.* 💅` });

        const parejas = parejasConfirmadas.get(groupId) || [];
        if (parejas.some(p => p.includes(m.sender) || parejas.some(p => p.includes(mencionado))) {
            return conn.sendMessage(m.chat, { text: `*🚨 YA TIENEN PAREJA, DEJEN DE SER INFIELES.*\n*Free Fire no tiene celos, pero este bot sí.* 😤` });
        }

        mensajesGrupos.set(groupId, { proponente: m.sender, propuesto: mencionado });

        const buttons = [
            { buttonId: 'aceptar', buttonText: { displayText: 'ACEPTAR 💖' } },
            { buttonId: 'rechazar', buttonText: { displayText: 'RECHAZAR 💔' } }
        ];

        await conn.sendMessage(m.chat, { 
            text: `💥 *¡DESAFÍO ROMÁNTICO!* 💥\n\n*${await conn.getName(m.sender)} quiere ser novio/a de ${await conn.getName(mencionado)}.*\n\n*"¿Aceptas o eres un cobarde como los que huyen en Clash Squad?"* 😏\n\n*Elijan sabiamente...* 🔫`, 
            mentions: [mencionado],
            buttons: buttons,
            footer: "💌 El amor es un campo de batalla",
            headerType: 1
        });
        return;
    }

    // COMANDO PAREJAS (El chisme del grupo)
    if (response === 'parejas' || msgText === 'parejas') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        if (parejas.length === 0) return conn.sendMessage(m.chat, { text: `*💔 NINGUNA PAREJA AQUÍ...*\n*Todos están solos como un jugador sin clan.* 😂` });

        let lista = `🔥 *PAREJAS DEL GRUPO* 🔥\n\n`;
        for (const [user1, user2] of parejas) {
            lista += `💑 *${await conn.getName(user1)} + ${await conn.getName(user2)}*\n*"Relación más tóxica que ranked en Free Fire."* 💘\n\n`;
        }
        lista += `*¿Cuál durará más? Nadie sabe.* 😏`;

        await conn.sendMessage(m.chat, { text: lista });
        return;
    }
};

handler.command = /^(sernovios|parejas|terminar)$/i;
handler.group = true;
export default handler;
