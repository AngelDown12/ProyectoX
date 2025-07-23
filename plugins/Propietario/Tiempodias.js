
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) throw `⚠️ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘭𝘰𝘴 𝘥𝘪𝘢𝘴 𝘲𝘶𝘦 𝘲𝘶𝘪𝘦𝘳𝘦𝘴 𝘲𝘶𝘦 𝘦𝘴𝘵𝘦́ 𝘦𝘯 𝘦𝘴𝘵𝘦 𝘨𝘳𝘶𝘱𝘰.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} 30`

    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    var nDays = 86400000 * args[0]
    var now = new Date() * 1
    if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired += nDays
    else global.db.data.chats[who].expired = now + nDays
    let teks = `🕔 𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡 𝘴𝘦 𝘦𝘴𝘵𝘢𝘣𝘭𝘦𝘤𝘪𝘰 𝘤𝘰𝘮𝘰 𝘣𝘰𝘵 𝘮𝘦𝘯𝘴𝘶𝘢𝘭 𝘦𝘯 𝘦𝘴𝘵𝘦 𝘨𝘳𝘶𝘱𝘰.\n\n*Durante:* ${args[0]} Días\n\n*Cuenta regresiva :* ${msToDate(global.db.data.chats[who].expired - now)}\n\n𝗘𝗹𝗶𝘁𝗲𝗕𝗼𝘁𝗚𝗹𝗼𝗯𝗮𝗹 (𝗘𝗕𝗚)`
    conn.reply(m.chat, teks, m)
}
handler.help = ['expirar <días>']
handler.tags = ['owner']
handler.command = /^(tiempod|addexpired)$/i
handler.rowner = true
export default handler

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Días*\n ', h, ' *Horas*\n ', m, ' *Minutos*\n ', s, ' *Segundos* '].map(v => v.toString().padStart(2, 0)).join('')
}

