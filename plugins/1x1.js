import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listasGrupos = new Map();
let mensajesGrupos = new Map();
let parejasConfirmadas = new Map(); // groupId -> [[persona1, persona2]]

const getListasGrupo = (groupId) => {
    if (!listasGrupos.has(groupId)) {
        listasGrupos.set(groupId, {
            aceptar: ['\u2794'],
            rechazar: ['\u2794']
        });
    }
    return listasGrupos.get(groupId);
};

const reiniciarListas = (groupId) => {
    listasGrupos.set(groupId, {
        aceptar: ['\u2794'],
        rechazar: ['\u2794']
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

    if (response === 'terminar' || msgText === 'terminar') {
        const parejas = parejasConfirmadas.get(groupId) || [];
        const pareja = parejas.find(p => p[0] === m.sender || p[1] === m.sender);

        if (pareja) {
            const nuevasParejas = parejas.filter(p => p[0] !== m.sender && p[1] !== m.sender);
            parejasConfirmadas.set(groupId, nuevasParejas);
            await conn.sendMessage(m.chat, {
                text: `┏━━━━━━━━━━━━━━━━┓\n💔 *¡Ups!* La relación se terminó...\n\n✨ \"El amor es como el viento, no puedes verlo pero puedes sentirlo\"\n\n┗━━━━━━━━━━━━━━━━┛`,
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

    if (['aceptar', 'rechazar'].includes(response)) {
        const tipo = response;
        const tag = m.sender;
        const mensajeGuardado = mensajesGrupos.get(groupId);

        if (!mensajeGuardado) return;

        if (!mensajeGuardado.propuesto) {
            mensajeGuardado.propuesto = tag;
            mensajesGrupos.set(groupId, mensajeGuardado);
        }

        const proponente = mensajeGuardado.proponente;
        const propuesto = mensajeGuardado.propuesto;

        if (!proponente || tag !== propuesto) {
            await conn.sendMessage(m.chat, {
                text:
