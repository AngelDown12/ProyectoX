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

    const response = m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msgText || '';

    console.log('Response received:', response);

    if (response === 'yomismo' || msgText === 'yomismo') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        const pareja = parejas.find(p => p[0] === m.sender || p[1] === m.sender);

        if (pareja) {
            const nuevasParejas = parejas.filter(p => p[0] !== m.sender && p[1] !== m.sender);
            parejasConfirmadas.set(groupId, nuevasParejas);

            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nUy esto se pondrá bueno  estos dos panas @user y @user se van a dar en la madre .\n\n*Crea la sala y manda datos*` 
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nUy pana para que entras a este grupo si están pobre . Ponte a lavar platos mejor .\n┗━━━━━━━━━━━━━━━━┛`
            });
        }
        return;
    }

    if (['acepto', 'negado'].includes(response)) {
        const tipo = response === 'acepto' ? 'aceptar' : 'rechazar';
        const tag = m.sender;
        const mensajeGuardado = mensajesGrupos.get(groupId);
        const proponente = mensajeGuardado?.proponente;

        if (!proponente) return;

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

            const buttons = [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Yomismo",
                        id: "yomismo"
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Notengo",
                        id: "notengo"
                    })
                }
            ];

            const mensaje = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            mentionedJid: nuevaPareja
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: { text: `UY ESTO ESTARA BUENO ${nombre1} y ${nombre2} SE DARAN EN LA MADRE EN PVP QUIEN PONE SALA` },
                            footer: { text: "CONFIRMEN" },
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

    if (msgText?.startsWith('.1vs1')) {
        const nombreRemitente = await conn.getName(m.sender);

        if (parejasConfirmadas.get(groupId)?.some(par => par.includes(m.sender))) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nNo seas infiel, tú ya tienes pareja.\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [m.sender]
            });
            return;
        }

        mensajesGrupos.set(groupId, {
            proponente: m.sender
        });

        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "ACEPTO",
                    id: "acepto"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "NEGADO",
                    id: "negado"
                })
            }
        ];

        const mensaje = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {}
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: `🔥 Modo Insano Activado 🔥\n\n¿Quién se rifa un PVP conmigo?\n───────────────\n¡Vamos a darnos en la madre sin miedo! 👿\n\n${nombreRemitente} lanzó un reto.\n\nSelecciona una opción:` },
                        footer: { text: "💥 Elige tu destino" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    if (response === 'notengo' || msgText === 'notengo') {
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

handler.customPrefix = /^(acepto|negado|yomismo|notengo|\.1vs1.*)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
