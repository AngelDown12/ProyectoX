import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return;
    
    let chat = global.db.data.chats[m.chat];
    let usuario = `@${m.sender.split`@`[0]}`;
    
    // Mensaje personalizado para fkontak
    let fkontak = {
        key: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.messageStubParameters[0],
            participant: m.sender
        },
        message: {
            textMessage: {
                text: "Detección de Cambios en Grupo"
            }
        }
    };

    // Detectar cambios en el modo de aprobación
    if (chat.detect && m.messageStubType == 145) {
        const modo = m.messageStubParameters[0];
        let texto = '';
        
        if (modo === 'off') {
            texto = `*⚠️ CONFIGURACIÓN DEL GRUPO MODIFICADA ⚠️*\n\n*El administrador ${usuario} ha desactivado la opción de "Aprobar nuevos participantes".*\n\n*Ahora cualquier persona puede unirse al grupo directamente.*`;
        } else if (modo === 'on') {
            texto = `*⚠️ CONFIGURACIÓN DEL GRUPO MODIFICADA ⚠️*\n\n*El administrador ${usuario} ha activado la opción de "Aprobar nuevos participantes".*\n\n*Ahora se requiere aprobación para unirse al grupo.*`;
        }
        
        if (texto) {
            await this.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: fkontak });
        }
    }
    
    // Detectar solicitudes rechazadas
    if (chat.detect && m.messageStubType == 172) {
        if (m.messageStubParameters[1] === 'rejected') {
            const userRejected = m.messageStubParameters[0].split('@')[0];
            const texto = `*❌ SOLICITUD RECHAZADA ❌*\n\n*El administrador ${usuario} ha rechazado la solicitud de ingreso del número:* wa.me/${userRejected}\n\n*El usuario no podrá unirse al grupo.*`;
            
            await this.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: fkontak });
        }
    }
}

export default handler; 
