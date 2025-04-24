import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas por grupo
let listasGrupos = new Map();
let mensajesGrupos = new Map();

// Función para obtener o crear las listas de un grupo
const getListasGrupo = (groupId) => {
    if (!listasGrupos.has(groupId)) {
        listasGrupos.set(groupId, {
            squad1: ['➤'],
            suplente: ['➤']
        });
    }
    return listasGrupos.get(groupId);
};

// Función para reiniciar las listas de un grupo específico
const reiniciarListas = (groupId) => {
    listasGrupos.set(groupId, {
        squad1: ['➤'],
        suplente: ['➤']
    });
};

let handler = async (m, { conn, text, args }) => {
    const msgText = m.text;
    const groupId = m.chat;
    let listas = getListasGrupo(groupId);
    
    // Manejar el comando .1vs1
    if (msgText.toLowerCase().startsWith('.1vs1')) {
        reiniciarListas(groupId);
        listas = getListasGrupo(groupId);
        await mostrarLista(conn, m.chat, listas, []);
        return;
    }

    if (msgText.toLowerCase() !== 'acepto' && msgText.toLowerCase() !== 'negado') return;
    
    const usuario = m.sender.split('@')[0];
    const nombreUsuario = m.pushName || usuario;
    
    let squadType;
    let mentions = [];
    
    if (msgText.toLowerCase() === 'acepto') {
        squadType = 'squad1';
    } else {
        squadType = 'suplente';
    }
    
    // Borrar al usuario de otras escuadras
    Object.keys(listas).forEach(key => {
        const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
        if (index !== -1) {
            listas[key][index] = '➤';
        }
    });
    
    const libre = listas[squadType].findIndex(p => p === '➤');
    if (libre !== -1) {
        listas[squadType][libre] = `@${nombreUsuario}`;
        mentions.push(m.sender);
    }

    Object.values(listas).forEach(squad => {
        squad.forEach(member => {
            if (member !== '➤') {
                const userName = member.slice(1);
                const userJid = Object.keys(m.message.extendedTextMessage?.contextInfo?.mentionedJid || {}).find(jid => 
                    jid.split('@')[0] === userName || 
                    conn.getName(jid) === userName
                );
                if (userJid) mentions.push(userJid);
            }
        });
    });

    const mensajeGuardado = mensajesGrupos.get(groupId);
    if (mensajeGuardado) {
        await mostrarLista(conn, m.chat, listas, mentions, mensajeGuardado);
    } else {
        await mostrarLista(conn, m.chat, listas, mentions);
    }
    return;
}

async function mostrarLista(conn, chat, listas, mentions = [], mensajeUsuario = '') {
    const texto = `🔥 Modo Insano Activado 🔥

¿Quién se rifa un PVP conmigo? 
───────────────
¡Vamos a darnos en la madre sin miedo! 👿`;

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

    const mensaje = generateWAMessageFromContent(chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    mentionedJid: mentions
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: { text: texto },
                    footer: { text: "Selecciona una opción:" },
                    nativeFlowMessage: { buttons }
                })
            }
        }
    }, {});

    await conn.relayMessage(chat, mensaje.message, { messageId: mensaje.key.id });
}

export async function after(m, { conn }) {
    try {
        const button = m?.message?.buttonsResponseMessage;
        if (!button) return;

        const id = button.selectedButtonId;
        const groupId = m.chat;
        let listas = getListasGrupo(groupId);
        const numero = m.sender.split('@')[0];
        const nombreUsuario = m.pushName || numero;
        const tag = m.sender;

        Object.keys(listas).forEach(key => {
            const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
            if (index !== -1) {
                listas[key][index] = '➤';
            }
        });

        const squadType = id === 'acepto' ? 'squad1' : 'suplente';
        const libre = listas[squadType].findIndex(p => p === '➤');
        
        if (libre !== -1) {
            listas[squadType][libre] = `@${nombreUsuario}`;
            await conn.sendMessage(m.chat, {
                text: `✅ @${nombreUsuario} agregado a ${id === 'acepto' ? 'Acepto' : 'Negado'}`,
                mentions: [tag]
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `⚠️ ${id === 'acepto' ? 'Acepto' : 'Negado'} está llena`,
                mentions: [tag]
            });
        }
        
        const mensajeGuardado = mensajesGrupos.get(groupId);
        await mostrarLista(conn, m.chat, listas, [tag], mensajeGuardado);
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.customPrefix = /^(acepto|negado|\.1vs1.*)$/i
handler.command = new RegExp
handler.group = true

export default handler

