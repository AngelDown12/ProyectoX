import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listasGrupos = new Map();
let mensajesGrupos = new Map();
let parejasConfirmadas = new Map(); // groupId -> [[persona1, persona2]]

const getListasGrupo = (groupId) => {
    if (!listasGrupos.has(groupId)) {
        listasGrupos.set(groupId, {
            aceptar: ['➤'],
            rechazar: ['➤']
        });
    }
    return listasGrupos.get(groupId);
};

const reiniciarListas = (groupId) => {
    listasGrupos.set(groupId, {
        aceptar: ['➤'],
        rechazar: ['➤']
    });
};

let handler = async (m, { conn }) => {
    const msgText = m.text?.toLowerCase();
    const groupId = m.chat;

    // Detectar respuesta de botones
    const response = m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msgText || '';

    console.log('Response received:', response); // Debug log

    // Comando terminar
    if (response === 'terminar' || msgText === 'terminar') {
        console.log('Executing terminar command...'); // Debug log
        console.log('Current couples:', parejasConfirmadas.get(groupId)); // Debug log
        
        // Obtener todas las parejas del grupo
        const parejas = parejasConfirmadas.get(groupId) || [];
        
        // Buscar la pareja del remitente
        const pareja = parejas.find(p => p[0] === m.sender || p[1] === m.sender);
        console.log('Found couple:', pareja); // Debug log
        
        if (pareja) {
            // Eliminar la pareja del registro
            const nuevasParejas = parejas.filter(p => p[0] !== m.sender && p[1] !== m.sender);
            parejasConfirmadas.set(groupId, nuevasParejas);
            console.log('Updated couples list:', nuevasParejas); // Debug log
            
            // Enviar mensaje de ruptura
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\n💔 *¡Ups!* La relación se terminó...\n\n✨ "El amor es como el viento, no puedes verlo pero puedes sentirlo"\n\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: pareja
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\n❌ *No tienes pareja*\nNo puedes terminar una relación si no tienes pareja.\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [m.sender]
            });
        }
        return;
    }

    // Comando aceptar/rechazar
    if (['aceptar', 'rechazar'].includes(response)) {
        const tipo = response;
        const tag = m.sender;
        const mensajeGuardado = mensajesGrupos.get(groupId);
        const proponente = mensajeGuardado?.proponente;
        const propuesto = mensajeGuardado?.propuesto;

        if (!proponente || tag !== propuesto) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\n ESTA DECLARACIÓN NO ES PARA TI ... SAPO .l. \n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [tag]
            });
            return;
        }

        // Verificar que no se esté aceptando/rechazando a sí mismo
        if (proponente === tag) {
            await conn.sendMessage(m.chat, {
                text: tipo === 'aceptar' ? 
                    `┏━━━━━━━━━━━━━━━━┓\nNo puedes aceptarte a ti mismo, eso sería muy triste.\n┗━━━━━━━━━━━━━━━━┛` : 
                    `┏━━━━━━━━━━━━━━━━┓\nNo puedes rechazarte a ti mismo, ¡date una oportunidad!\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [tag]
            });
            return;
        }

        if (tipo === 'aceptar') {
            if (!parejasConfirmadas.has(groupId)) {
                parejasConfirmadas.set(groupId, []);
            }
            const nuevaPareja = [proponente, tag];
            const parejasActuales = parejasConfirmadas.get(groupId);
            parejasActuales.push(nuevaPareja);
            parejasConfirmadas.set(groupId, parejasActuales);

            const nombre1 = await conn.getName(tag);
            const nombre2 = await conn.getName(proponente);

            const buttons = [{
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Terminar",
                    id: "terminar"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Parejas",
                    id: "parejas"
                })
            }];

            const mensaje = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            mentionedJid: nuevaPareja
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: { text: `┏━━━━━━━━━━━━━━━━┓\n🎉 *¡Felicidades!*\n\n💕 "El amor no tiene edad, siempre está naciendo"\n\nAhora ${nombre1} y ${nombre2} son novios.\n\n✨ Que el amor los acompañe siempre.\n┗━━━━━━━━━━━━━━━━┛` },
                            footer: { text: "💫 Elige con el corazón" },
                            nativeFlowMessage: { buttons }
                        })
                    }
                }
            }, {});

            await conn.relayMessage(m.chat, mensaje.message, {});
        } else {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\n💔 *Rechazo*\n\n💫 "El amor es como una mariposa, si lo persigues, te eludirá"\n\n${await conn.getName(tag)} rechazó tu propuesta de amor.\n\n✨ No te rindas, el amor verdadero te espera.\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [proponente]
            });
        }

        mensajesGrupos.delete(groupId);
        return;
    }

    // Comando .1vs1
    if (msgText?.startsWith('.1vs1')) {
        const mentionedJid = m.mentionedJid?.[0];
        if (!mentionedJid) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nDebes mencionar a alguien para el 1vs1.\n\n💡 Ejemplo: .1vs1 @usuario\n┗━━━━━━━━━━━━━━━━┛`
            });
            return;
        }

        // Verificar que no se esté mencionando a sí mismo
        if (mentionedJid === m.sender) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nNo puedes declararte a ti mismo, eso sería muy triste.\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [m.sender]
            });
            return;
        }

        const parejas = parejasConfirmadas.get(groupId) || [];
        if (parejas.some(par => par.includes(m.sender) || par.includes(mentionedJid))) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nNo seas infiel, tú ya tienes pareja.\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [m.sender]
            });
            return;
        }

        const nombreRemitente = await conn.getName(m.sender);
        const nombreMencionado = await conn.getName(mentionedJid);

        mensajesGrupos.set(groupId, {
            proponente: m.sender,
            propuesto: mentionedJid
        });

        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Aceptar",
                    id: "aceptar"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Rechazar",
                    id: "rechazar"
                })
            }
        ];

        const mensaje = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        mentionedJid: [mentionedJid]
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: `┏━━━━━━━━━━━━━━━━┓\n⚔️ *¡Desafío 1vs1!*\n\n💫 "La batalla está por comenzar"\n\n${nombreRemitente} te ha desafiado ${nombreMencionado}\n\n✨ ¿Aceptas el desafío?\n┗━━━━━━━━━━━━━━━━┛` },
                        footer: { text: "⚔️ Elige tu destino" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    // Comando parejas (antes .listanovios)
    if (response === 'parejas' || msgText === 'parejas') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        if (parejas.length === 0) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\n💔 *No hay parejas*\n\n💫 "El amor es como una flor, necesita tiempo para crecer"\n\nNo hay parejas registradas en este grupo.\n\n✨ ¿Por qué no inicias una historia de amor?\n┗━━━━━━━━━━━━━━━━┛`
            });
            return;
        }

        let lista = `┏━━━━━━━━━━━━━━━━┓\n❣️ *Parejas del grupo*\n\n💫 "El amor es la única respuesta"\n\n`;
        for (const [p1, p2] of parejas) {
            const nombre1 = await conn.getName(p1);
            const nombre2 = await conn.getName(p2);
            lista += `✨ ${nombre1} 💕 ${nombre2}\n`;
        }
        lista += `\n┗━━━━━━━━━━━━━━━━┛`;

        await conn.sendMessage(m.chat, {
            text: lista.trim()
        });
        return;
    }
};

handler.customPrefix = /^(aceptar|rechazar|terminar|parejas|\.1vs1.*)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
