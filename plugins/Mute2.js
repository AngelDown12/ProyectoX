import { canModifyGroup } from '@whiskeysockets/baileys';

let mutedUsers = {}; // Base de datos temporal de muteados

const handler = async (m, { conn, args, participants, isAdmin, isBotAdmin }) => {
    // Verificación mejorada de permisos
    if (!m.isGroup) return m.reply('*⚠️ Este comando solo funciona en grupos*');
    if (!isBotAdmin) return m.reply('*🤖 ¡El bot necesita ser admin para mutear!*');
    if (!isAdmin) return m.reply('*👑 Solo admins pueden usar este comando*');

    // Detección mejorada de menciones
    const mention = m.mentionedJid[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
    if (!mention) return m.reply('*🔎 Etiqueta al usuario o escribe su número*\nEjemplo: *.mute2 @usuario*');

    // Evitar mutear a admins
    const isTargetAdmin = participants.find(p => p.id === mention)?.admin;
    if (isTargetAdmin) return m.reply('*⚔️ No puedes mutear a otro admin*');

    try {
        // Mute permanente (restrict sin tiempo)
        await conn.groupParticipantsUpdate(m.chat, [mention], 'restrict');
        
        // Registrar en la "base de datos"
        if (!mutedUsers[m.chat]) mutedUsers[m.chat] = [];
        mutedUsers[m.chat].push(mention);

        // Mensaje de confirmación con estilo
        await conn.sendMessage(m.chat, {
            text: `▄︻デ══━ *MUTE PERMANENTE* ══━︻▄

• *Usuario:* @${mention.split('@')[0]}
• *Razón:* Comportamiento tóxico 🚫
• *Duración:* INFINITO 🔄
• *Sancionado por:* @${m.sender.split('@')[0]}

_"El silencio es tu nuevo mejor amigo"_ 🤐`,
            mentions: [mention, m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error('Error al mutear:', error);
        m.reply('*🚨 Error al mutear* ¿El usuario tiene protección?');
    }
};

// Comando para ver muteados (opcional)
const listMuted = async (m) => {
    if (!mutedUsers[m.chat]?.length) return m.reply('*📭 No hay usuarios muteados en este grupo*');
    
    let text = '╔═══════════════╗\n   *🔇 USUARIOS MUTEADOS*   \n╚═══════════════╝\n\n';
    mutedUsers[m.chat].forEach(user => {
        text += `• @${user.split('@')[0]}\n`;
    });
    
    await m.reply(text, null, { mentions: mutedUsers[m.chat] });
};

// Configuración del handler
handler.help = ['mute2 @usuario'];
handler.tags = ['moderacion'];
handler.command = /^(mute2|mutar|silenciar)$/i; // Detecta múltiples comandos
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export { handler, listMuted };
