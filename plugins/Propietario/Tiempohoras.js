
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) throw `⚠️ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘭𝘢𝘴 𝘩𝘰𝘳𝘢𝘴 𝘲𝘶𝘦 𝘲𝘶𝘪𝘦𝘳𝘦𝘴 𝘲𝘶𝘦 𝘦𝘴𝘵𝘦́ 𝘦𝘯 𝘦𝘴𝘵𝘦 𝘨𝘳𝘶𝘱𝘰.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} 30`

    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    var nHours = 3600000 * args[0]
    var now = new Date() * 1
    if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired += nHours
    else global.db.data.chats[who].expired = now + nHours
    let teks = `🕔 Se activo la prueba gratis de 𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡, disfruta la variedad de comandos de 𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡 con la palabra .menu \n\n» *Tiempo :* ${args[0]} Horas\n\n*Cuenta regresiva :*\n ${msToDate(global.db.data.chats[who].expired - now)}\n\n𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡 (𝗘𝗕𝗚)`
    conn.reply(m.chat, teks, m)
}
handler.help = ['expirar <Horas>']
handler.tags = ['owner']
handler.command = /^(tiempoh|addexpired)$/i
handler.rowner = true
export default handler

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Días*\n ', h, ' *Horas*\n ', m, ' *Minutos*\n ', s, ' *Segundos* '].map(v => v.toString().padStart(2, 0)).join('')
}

