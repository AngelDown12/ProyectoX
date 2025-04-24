import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listasGrupos = new Map();
let mensajesGrupos = new Map();

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

    // Comando .1vs1
    if (msgText?.startsWith('.1vs1')) {
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
};

handler.customPrefix = /^(acepto|negado|\.1vs1.*)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
