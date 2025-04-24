const handler = async (m, { conn, usedPrefix, command, args }) => {
    // Obtener información del remitente
    const user = m.sender;
    const contact = await conn.getContact(user);
    const pushname = contact.pushname || 'Sin nombre';
    const status = (await conn.fetchStatus(user)).status || 'Sin estado';
    
    // Obtener país basado en el código de teléfono
    const countryCodes = {
        '1': '🇺🇸 EE.UU.', '52': '🇲🇽 México', '54': '🇦🇷 Argentina',
        '55': '🇧🇷 Brasil', '56': '🇨🇱 Chile', '57': '🇨🇴 Colombia',
        '58': '🇻🇪 Venezuela', '51': '🇵🇪 Perú', '593': '🇪🇨 Ecuador',
        '34': '🇪🇸 España', '33': '🇫🇷 Francia', '44': '🇬🇧 Reino Unido'
    };
    
    const phoneNumber = user.split('@')[0];
    let country = '🌍 Desconocido';
    for (const [code, name] of Object.entries(countryCodes)) {
        if (phoneNumber.startsWith(code)) {
            country = name;
            break;
        }
    }
    
    // Obtener imagen de perfil
    const pfp = await conn.profilePictureUrl(user, 'image').catch(() => 'https://i.imgur.com/8l1jO7W.jpg');
    
    // Construir mensaje
    const message = `
*╭━━━━━━━〘 PERFIL 〙━━━━━━━╮*
    
📌 *Nombre:* ${pushname}
📍 *País:* ${country}
📱 *Número:* ${phoneNumber}
📝 *Estado:* ${status}
    
*╰━━━━━━━〘 ${conn.getName(conn.user.jid)} 〙━━━━━━━╯*
    `;
    
    // Enviar mensaje con imagen de perfil
    await conn.sendMessage(m.chat, {
        image: { url: pfp },
        caption: message,
        mentions: [user]
    }, { quoted: m });
};

handler.help = ['perfil'];
handler.tags = ['info'];
handler.command = /^(perfil|profile|miperfil)$/i;

export default handler;
