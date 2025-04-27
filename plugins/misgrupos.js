import moment from 'moment-timezone'
import PhoneNum from 'awesome-phonenumber'

let regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

let handler = async (m, { conn, text, usedPrefix, command: cmd }) => {
    let num = m.quoted?.sender || m.mentionedJid?.[0] || text
    if (!num) throw `*Ejemplo*: ${usedPrefix + cmd} @tag 50492280729`
    num = num.replace(/\D/g, '') + '@s.whatsapp.net'
    
    // Verificar si el número existe en WhatsApp
    let waUser = await conn.onWhatsApp(num)
    if (!waUser[0]?.exists) throw 'Este usuario no existe, asegúrese de escribir bien el número.'
    
    // Obtener la imagen de perfil (o usar una por defecto)
    let img = await conn.profilePictureUrl(num, 'image').catch(_ => './src/avatar_contact.png')
    
    // Obtener la biografía (manejar errores correctamente)
    let bio = {}
    try {
        bio = await conn.fetchStatus(num)
    } catch (e) {
        console.error('Error al obtener la biografía:', e)
        bio = { status: 'No disponible', setAt: null }
    }
    
    // Obtener el nombre
    let name = await conn.getName(num).catch(_ => 'No disponible')
    
    // Obtener información de negocio (si existe)
    let business = {}
    try {
        business = await conn.getBusinessProfile(num)
    } catch (e) {
        console.error('Error al obtener información de negocio:', e)
        business = null
    }
    
    // Formatear número de teléfono y país
    let phoneNum = PhoneNum(`+${num.split('@')[0]}`)
    let country = regionNames.of(phoneNum.getRegionCode('international')) || 'Desconocido'
    
    // Construir el mensaje
    let wea = `
> •*WhatsApp Stalking🍁*

*País:* ${country.toUpperCase()}
*Nombre:* ${name}
*Formato:* ${phoneNum.getNumber('international')}
*Url:* wa.me/${num.split('@')[0]}
*Tag:* @${num.split('@')[0]}
*Biografía:* ${bio?.status || 'No disponible'}
*Última actualización de biografía:* ${bio?.setAt ? moment(bio.setAt).locale('es').format('LL') : 'No disponible'}`

    // Añadir información de negocio si existe
    if (business) {
        wea += `\n\n*Business Info 🫐*
*BusinessId:* ${business.wid}
*Website:* ${business.website || '-'}
*Email:* ${business.email || '-'}
*Categoría:* ${business.category}
*Dirección:* ${business.address || '-'}
*Zona Horaria:* ${business.business_hours?.timezone || '-'}
*Descripción:* ${business.description || '-'}`
    } else {
        wea += '\n\n> •*Cuenta Personal de WhatsApp*'
    }
    
    // Enviar mensaje con imagen o solo texto
    if (img) {
        await conn.sendMessage(m.chat, { 
            image: { url: img }, 
            caption: wea, 
            mentions: [num] 
        }, { quoted: m })
    } else {
        await m.reply(wea)
    }
}

handler.help = ['wastalk *<numero>*']
handler.tags = ['tools']
handler.command = /^(wa|whatsapp)stalk|perfil$/i

export default handler
