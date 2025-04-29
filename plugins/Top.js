import util from 'util'
import path from 'path'

let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
    if (!text) return m.reply(`🎮 *Uso:*\n${usedPrefix}top <texto>\nEjemplo: ${usedPrefix}top feos`)

    let ps = groupMetadata.participants.map(v => v.id)
    let winners = Array.from({ length: 10 }, () => ps.getRandom())
    let groupName = groupMetadata.subject || "este grupo"
    
    // Emojis aleatorios según el contexto
    let emoji = pickRandom(['🏆', '🔥', '💀', '👀', '🤡', '🎮', '👑', '💩', '🍑', '😂'])
    
    // Frases personalizadas para los primeros puestos (puedes agregar más)
    const frasesTop = {
        1: ["¡El/La nº1 indiscutible! 👑", "¡Insuperable! 😎", "¡Leyenda viviente! 🏆"],
        2: ["¡Por poco le gana al primero! 😅", "¡Seguro el próximo mes es suyo! 🥈", "¡Merecido segundo lugar! 🔥"],
        3: ["¡No está mal para ser bronce! 🥉", "¡Casi, casi! 😂", "¡Top 3, felicidades! 🎉"]
    }
    
    // Título personalizado con el nombre del grupo
    let title = `TOP 10 ${text.toUpperCase()} DE ${groupName.toUpperCase()}`
    
    // Mensaje con diseño mejorado + frases aleatorias para los top 3
    let top = `
╔═══════════════════════════
║ ${emoji} *${title}* ${emoji}
╠═══════════⋆★⋆════════
║ 🥇 ${user(winners[0])} - ${pickRandom(frasesTop[1])}
║ 🥈 ${user(winners[1])} - ${pickRandom(frasesTop[2])}
║ 🥉 ${user(winners[2])} - ${pickRandom(frasesTop[3])}
║ 4. ${user(winners[3])}
║ 5. ${user(winners[4])}
║ 6. ${user(winners[5])}
║ 7. ${user(winners[6])}
║ 8. ${user(winners[7])}
║ 9. ${user(winners[8])}
║ 10. ${user(winners[9])}
╚═══════════════════════════
*¡Ranking oficial del grupo!* 🎮`.trim()

    // Enviar el mensaje con menciones
    conn.sendMessage(m.chat, { 
        text: top, 
        mentions: winners,
        contextInfo: {
            externalAdReply: {
                title: title,
                body: `Top 10 ${text} de ${groupName}`,
                thumbnailUrl: "https://i.imgur.com/JQH8ZnA.png" // Imagen de trofeo o algo gracioso
            }
        }
    })
}

handler.help = handler.command = ['topp']
handler.tags = ['fun', 'games']
handler.group = true
export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
