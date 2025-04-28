let mutedUsers = new Set()

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!m.quoted && !m.mentionedJid[0]) throw `🌠 *¿A quién deseas mutear?*\n\n✨ *Ejemplo:*\n${usedPrefix + command} @usuario`
    
    // Extracción INFALIBLE del usuario (como en tu plugin 'mirar')
    let user = m.mentionedJid[0] || m.quoted.sender
    
    // Acciones (manteniendo tu estilo de mensajes)
    if (/^\.?mute2$/i.test(command)) {
        mutedUsers.add(user)
        await conn.sendMessage(m.chat, {
            text: `🔇 *@${user.split('@')[0]} muteado*\n¡Sus mensajes serán eliminados!`,
            mentions: [user]
        }, { quoted: m })
        await m.react('🚫')
    } 
    else if (/^\.?unmute2$/i.test(command)) {
        mutedUsers.delete(user)
        await conn.sendMessage(m.chat, {
            text: `✅ *@${user.split('@')[0]} desmuteado*\n¡Ya puede enviar mensajes!`,
            mentions: [user]
        }, { quoted: m })
        await m.react('👌')
    }
}

// Anti-mensajes (mejorado)
handler.before = async (m) => {
    if (mutedUsers.has(m.sender) {
        try {
            await m.delete()
        } catch (e) {
            console.log('Error al borrar mensaje:', e)
        }
    }
}

handler.help = ['mute2 @usuario', 'unmute2 @usuario']
handler.tags = ['moderación']
handler.command = /^(mute2|unmute2)$/i
handler.admin = true
handler.group = true

export default handler
