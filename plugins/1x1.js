import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listasGrupos = new Map();

const getListasGrupo = (groupId) => {
    if (!listasGrupos.has(groupId)) {
        listasGrupos.set(groupId, {
            aceptar: [],
            rechazar: []
        });
    }
    return listasGrupos.get(groupId);
};

const reiniciarListas = (groupId) => {
    listasGrupos.set(groupId, {
        aceptar: [],
        rechazar: []
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

    // Comando .1vs1
    if (msgText?.startsWith('.1vs1')) {
        reiniciarListas(groupId);
        const listas = getListasGrupo(groupId);

        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "YOMISMO",
                    id: "yomismo"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "NOTENGO",
                    id: "notengo"
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

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    // Comando acepto/negado
    if (['acepto', 'negado'].includes(response)) {
        const tipo = response;
        const tag = m.sender;
        const listas = getListasGrupo(groupId);
        const nombreUsuario = await conn.getName(tag);

        if (tipo === 'acepto') {
            listas.aceptar.push(nombreUsuario);
            await conn.sendMessage(m.chat, {
                text: `🔥 @${nombreUsuario} se ha unido al PVP! 🔥`,
                mentions: [tag]
            });
        } else {
            listas.rechazar.push(nombreUsuario);
            await conn.sendMessage(m.chat, {
                text: `✅ @${nombreUsuario} agregado a Negado`,
                mentions: [tag]
            });
        }

        // Crear el mensaje actualizado con las listas
        const mensaje = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        mentionedJid: [tag]
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { 
                            text: `🔥 Modo Insano Activado 🔥

¿Quién se rifa un PVP conmigo? 
───────────────
¡Vamos a darnos en la madre sin miedo! 👿

**Aceptados:** ${listas.aceptar.join(', ')}
**Negados:** ${listas.rechazar.join(', ')}` 
                        },
                        footer: { text: "Selecciona una opción:" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    // Respuesta de botones "YOMISMO" y "NOTENGO"
    if (['yomismo', 'notengo'].includes(response)) {
        const tag = m.sender;
        const nombreUsuario = await conn.getName(tag);
        
        if (response === 'yomismo') {
            await conn.sendMessage(m.chat, {
                text: `🔥 @${nombreUsuario} se ha elegido a sí mismo! 🔥`,
                mentions: [tag]
            });
        } else if (response === 'notengo') {
            await conn.sendMessage(m.chat, {
                text: `😓 @${nombreUsuario} no tiene la actitud para el PVP! 😓`,
                mentions: [tag]
            });
        }

        // Aquí puedes incluir más lógica si deseas que el mensaje se actualice de alguna manera
        return;
    }
};

handler.customPrefix = /^(acepto|negado|\.1vs1.*|yomismo|notengo)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
