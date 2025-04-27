import { canModifyGroup } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, participants, isBotAdmin, isAdmin }) => {
    // Verificación de permisos mejorada
    if (!isBotAdmin) return m.reply('*🚨 El bot no es admin, no puede mutear* 🤖💔');
    if (!isAdmin) return m.reply('*🔐 Solo admins pueden usar este comando* 👑');
    
    // Obtener usuario mencionado
    const target = m.mentionedJid[0] || args[0];
    if (!target) return m.reply('*📍 Etiqueta al usuario*\nEjemplo: .mute2 @usuario');
    
    // No mutear al dueño del grupo
    const groupMetadata = await conn.groupMetadata(m.chat);
    if (target === groupMetadata.owner) return m.reply('*👑 No puedes mutear al rey del grupo*');

    // Mute permanente (sin tiempo)
    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'restrict');
        
        // Mensaje épico de confirmación
        await conn.sendMessage(m.chat, { 
            text: `╔════════════════╗
            
  *🔇 MUTE PERMANENTE* 🔕
  
  ╚════════════════╝
  
  ▢ *Usuario:* @${target.split('@')[0]}
  ▢ *Razón:* Comportamiento tóxico ☣️
  ▢ *Sanción:* SIN CHAT POR SIEMPRE
  ▢ *Admin:* @${m.sender.split('@')[0]}
  
  *"Aquí termina tu viaje, noob"* 🎮⚰️`,
            mentions: [target, m.sender]
        }, { quoted: m });

        // Añadir a lista de muteados
        if (!conn.mutedUsers) conn.mutedUsers = {};
        conn.mutedUsers[target] = true;

    } catch (error) {
        console.error(error);
        m.reply('*⚠️ Error al mutear* ¿El usuario es admin?');
    }
};

// Comando para ver muteados
const listMutedHandler = async (m, { conn }) => {
    if (!conn.mutedUsers) return m.reply('*📭 No hay usuarios muteados*');
    
    let text = '╔════════════════╗\n     *🔇 USUARIOS MUTEADOS* \n╚════════════════╝\n\n';
    for (let user in conn.mutedUsers) {
        text += `▢ @${user.split('@')[0]}\n`;
    }
    await conn.sendMessage(m.chat, { text, mentions: Object.keys(conn.mutedUsers).map(u => u) });
};

handler.help = ['mute2 @usuario', 'listamute'];
handler.tags = ['moderacion'];
handler.command = /^(mute2|listamute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export { handler, listMutedHandler };
