import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn }) => {
    const msgText = m.text?.toLowerCase();
    const groupId = m.chat;

    const response =
        m.message?.buttonsResponseMessage?.selectedButtonId ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseButtonResponse?.id ||
        m.message?.interactiveResponseMessage?.buttonReplyMessage?.selectedId ||
        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msgText || '';

    const nombreRemitente = await conn.getName(m.sender);

    if (msgText?.startsWith('.1vs1')) {
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
                    messageContextInfo: {},
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

    if (response === 'acepto') {
        const nombre = await conn.getName(m.sender);

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
                        mentionedJid: [m.sender]
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: `UY ESTO ESTARÁ BUENO, ${nombre} aceptó el reto de PVP.` },
                        footer: { text: "CONFIRMEN" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, {});
        return;
    }

    if (response === 'negado') {
        const nombre = await conn.getName(m.sender);
        await conn.sendMessage(m.chat, {
            text: `┏━━━━━━━━━━━━━━━━┓\nUY PANA SE NOTA EL MIEDO DE NO JUGARLE A PVP A ${nombre.toUpperCase()}...\n┗━━━━━━━━━━━━━━━━┛`,
            mentions: [m.sender]
        });
        return;
    }

    if (response === 'yomismo') {
        await conn.sendMessage(m.chat, {
            text: `┏━━━━━━━━━━━━━━━━┓\nUy esto se pondrá bueno, estos dos panas @user y @user se van a dar en la madre.\n\n*Crea la sala y manda datos*\n┗━━━━━━━━━━━━━━━━┛`
        });
        return;
    }

    if (response === 'notengo') {
        await conn.sendMessage(m.chat, {
            text: `┏━━━━━━━━━━━━━━━━┓\nUy pana para que entras a este grupo si están pobres. Ponte a lavar platos mejor.\n┗━━━━━━━━━━━━━━━━┛`
        });
        return;
    }
};

handler.customPrefix = /^(acepto|negado|yomismo|notengo|\.1vs1.*)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
