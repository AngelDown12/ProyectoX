const handler = async (m, { conn, usedPrefix, command }) => {
    // Obtener información del usuario
    const user = m.sender
    const pushname = m.pushName || 'Sin nombre'
    
    // Obtener el estado (bio) del usuario
    let status = 'Sin estado'
    try {
        const statusData = await conn.fetchStatus(user)
        status = statusData.status || status
    } catch (e) {
        console.error('Error al obtener estado:', e)
    }

    // Si no se obtiene el estado, intentamos usar un estado predeterminado
    if (status === 'Sin estado') {
        status = 'El usuario no ha configurado un estado.'
    }
    
    // Mapeo de códigos de país
    const countryCodes = {
        '1': '🇺🇸 EE.UU.', '52': '🇲🇽 México', '54': '🇦🇷 Argentina',
        '55': '🇧🇷 Brasil', '56': '🇨🇱 Chile', '57': '🇨🇴 Colombia',
        '58': '🇻🇪 Venezuela', '51': '🇵🇪 Perú', '593': '🇪🇨 Ecuador',
        '34': '🇪🇸 España', '33': '🇫🇷 Francia', '44': '🇬🇧 Reino Unido',
        '7': '🇷🇺 Rusia', '49': '🇩🇪 Alemania', '39': '🇮🇹 Italia'
    }
    
    // Determinar país
    const phoneNumber = user.split('@')[0]
    let country = '🌍 Desconocido'
    for (const [code, name] of Object.entries(countryCodes)) {
        if (phoneNumber.startsWith(code)) {
            country = name
            break
        }
    }
    
    // Obtener imagen de perfil
    let pfpUrl
    try {
        pfpUrl = await conn.profilePictureUrl(user, 'image')
    } catch (e) {
        console.error('Error al obtener foto de perfil:', e)
        pfpUrl = 'https://i.imgur.com/8l1jO7W.jpg' // Imagen por defecto
    }
    
    // Construir mensaje
    const message = `
*╭━━━━━━━〘 PERFIL 〙━━━━━━━╮*

📌 *Nombre:* ${pushname}
📍 *País:* ${country}
📱 *Número:* ${phoneNumber}
📝 *Estado:* ${status}

*╰━━━━━━━〘 ${conn.user.name} 〙━━━━━━━╯*
    `.trim()
    
    // Enviar mensaje
    await conn.sendMessage(m.chat, {
        image: { url: pfpUrl },
        caption: message,
        mentions: [user]
    }, { quoted: m })
}

handler.help = ['perfil']
handler.tags = ['info']
handler.command = /^(perfil|profile|miperfil)$/i

export default handler
