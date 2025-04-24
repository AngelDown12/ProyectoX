import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let mensajesGrupos = new Map(); // groupId -> { proponente, aceptado: boolean, rechazado: boolean }
let parejasConfirmadas = new Map(); // groupId -> [[persona1, persona2]]

let handler = async (m, { conn }) => {
    const msgText = m.text?.toLowerCase();
    const groupId = m.chat;

    const response = m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msgText || '';

    if (['acepto', 'negado'].includes(response)) {
        const tipo = response === 'acepto' ? 'aceptado' : 'rechazado';
        const tag = m.sender;
        const mensajeGuardado = mensajesGrupos.get(groupId);

        if (!mensajeGuardado || !mensajeGuardado.proponente) return;

        const proponente = mensajeGuardado.proponente;

        if (proponente === tag) {
            await conn.sendMessage(m.chat, {
                text: tipo === 'aceptado'
                    ? `┏━━━━━━━━━━━━━━━━┓\nNo puedes aceptarte a ti mismo, eso sería muy triste.\n┗━━━━━━━━━━━━━━━━┛`
                    : `┏━━━━━━━━━━━━━━━━┓\nNo puedes rechazarte a ti mismo, ¡date una oportunidad!\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [tag]
            });
            return;
        }

        if (mensajeGuardado[tipo]) return; // Ya había respondido así

        mensajeGuardado[tipo] = tag;
        mensajesGrupos.set(groupId, mensajeGuardado);

        if (tipo === 'aceptado') {
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
                            mentionedJid: nuevaPareja
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: { text: `UY ESTO ESTARÁ BUENO ${nombre1} y ${nombre2} SE DARÁN EN LA MADRE EN PVP QUIÉN PONE SALA` },
                            footer: { text: "CONFIRMEN" },
                            nativeFlowMessage: { buttons }
                        })
                    }
                }
            }, {});

            await conn.relayMessage(m.chat, mensaje.message, {});
        }

        if (tipo === 'rechazado') {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nUy pana se nota el miedo de no jugarle a PVP a @user\n┗━━━━━━━━━━━━━━━━┛`,
                mentions: [proponente]
            });
        }

        // Elimina el registro solo si ya hubo respuesta
        if (mensajeGuardado.aceptado || mensajeGuardado.rechazado) {
            mensajesGrupos.delete(groupId);
        }

        return;
    }

    if (msgText?.startsWith('.1vs1')) {
        const nombreRemitente = await conn.getName(m.sender);

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
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: {
                            text: `🔥 Modo Insano Activado 🔥\n\n¿Quién se rifa un PVP conmigo?\n───────────────\n¡Vamos a darnos en la madre sin miedo! 👿\n\n${nombreRemitente} lanzó un reto.\n\nSelecciona una opción:`
                        },
                        footer: { text: "💥 Elige tu destino" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    if (response === 'yomismo') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        const pareja = parejas.find(p => p[0] === m.sender || p[1] === m.sender);

        if (pareja) {
            const nuevas = parejas.filter(p => p[0] !== m.sender && p[1] !== m.sender);
            parejasConfirmadas.set(groupId, nuevas);

            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nUy esto se pondrá bueno estos dos panas @user y @user se van a dar en la madre.\n\n*Crea la sala y manda datos*`,
                mentions: pareja
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nUy pana para qué entras si están pobre. Ponte a lavar platos mejor.\n┗━━━━━━━━━━━━━━━━┛`
            });
        }
    }

    if (response === 'notengo') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        if (!parejas.length) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nUy pana para qué entras si están pobre. Ponte a lavar platos mejor.\n┗━━━━━━━━━━━━━━━━┛`
            });
            return;
        }

        let lista = `┏━━━━━━━━━━━━━━━━┓\n📜 Lista de Parejas Confirmadas:\n`;
        for (const [p1, p2] of parejas) {
            const nombre1 = await conn.getName(p1);
            const nombre2 = await conn.getName(p2);
            lista += `✨ ${nombre1} 💕 ${nombre2}\n`;
        }
        lista += `┗━━━━━━━━━━━━━━━━┛`;

        await conn.sendMessage(m.chat, {
            text: lista.trim()
        });
    }
};

handler.customPrefix = /^(acepto|negado|yomismo|notengo|\.1vs1.*)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
