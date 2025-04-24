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

    // Comando .1vs1
    if (msgText === '.1vs1') {
        try {
            reiniciarListas(groupId);
            const listas = getListasGrupo(groupId);

            const buttons = [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Acepto",
                        id: "acepto"
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Negado",
                        id: "negado"
                    })
                }
            ];

            const mensaje = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            mentionedJid: []
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: { text: `🔥 Modo Insano Activado 🔥

¿Quién se rifa un PVP conmigo? 
───────────────
¡Vamos a darnos en la madre sin miedo! 👿` },
                            footer: { text: "Selecciona una opción:" },
                            nativeFlowMessage: { buttons }
                        })
                    }
                }
            }, {});

            await conn.relayMessage(m.chat, mensaje.message, { messageId: `1vs1-${Date.now()}` });
            return;
        } catch (error) {
            console.error('Error en comando 1vs1:', error);
            m.reply('❌ Ocurrió un error al procesar el comando');
            return;
        }
    }

    // Comando acepto/negado
    if (['acepto', 'negado'].includes(response)) {
        const tipo = response;
        const tag = m.sender;
        const listas = getListasGrupo(groupId);
        const nombreUsuario = await conn.getName(tag);

        if (tipo === 'acepto') {
            await conn.sendMessage(m.chat, {
                text: `UY ESTO SE PONDRA BUENO QUIEN PONE SALA`,
                mentions: [tag]
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `✅ @${nombreUsuario} agregado a Negado`,
                mentions: [tag]
            });
        }

        // Actualizar el mensaje con la nueva lista
        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Acepto",
                    id: "acepto"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Negado",
                    id: "negado"
                })
            }
        ];

        const mensaje = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        mentionedJid: [tag]
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: `🔥 Modo Insano Activado 🔥

¿Quién se rifa un PVP conmigo? 
───────────────
¡Vamos a darnos en la madre sin miedo! 👿` },
                        footer: { text: "Selecciona una opción:" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    // Comando .sernovios (antes .quieresserminovia)
    if (msgText?.startsWith('.sernovios')) {
        const mentionedJid = m.mentionedJid?.[0];
        if (!mentionedJid) {
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\nDebes mencionar a alguien para declararte.\n\n💡 Ejemplo: .sernovios @usuario\n┗━━━━━━━━━━━━━━━━┛`
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
                        body: { text: `┏━━━━━━━━━━━━━━━━┓\n💌 *¡Declaración de amor!*\n\n💫 "El amor es la poesía de los sentidos"\n\n${nombreRemitente} se te está declarando ${nombreMencionado}\n\n✨ ¿Qué respondes?\n┗━━━━━━━━━━━━━━━━┛` },
                        footer: { text: "💕 Elige con el corazón" },
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

handler.customPrefix = /^(acepto|negado|terminar|parejas|\.1vs1.*|\.sernovios.*)$/i;
handler.help = ['1vs1'];
handler.tags = ['juegos'];
handler.command = ['1vs1'];
handler.group = true;
handler.limit = false;
handler.premium = false;
handler.register = false;
handler.fail = null;
handler.spam = false;

export default handler;
