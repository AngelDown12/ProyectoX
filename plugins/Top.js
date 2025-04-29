import util from 'util'
import path from 'path'

async function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
    if (!text) return m.reply(`🎮 *Uso:*\n${usedPrefix}top <texto>\nEjemplo: ${usedPrefix}top feos`)

    let participants = groupMetadata.participants
    let winners = Array.from({ length: 10 }, () => participants[Math.floor(Math.random() * participants.length)])
    
    // Obtenemos los nombres de los ganadores
    let winnersInfo = await Promise.all(
        winners.map(async (user) => {
            let contact = await conn.getName(user.id) // Obtiene el nombre del usuario
            return { id: user.id, name: contact || user.id.split('@')[0] } // Usa el nombre o el número si no hay nombre
        })
    )

    let groupName = groupMetadata.subject || "este grupo"
    let emoji = pickRandom(['🏆', '🔥', '💀', '👀', '🤡', '🎮', '👑', '💩', '🍑', '😂'])
    
    // Frases personalizadas para los top 3
    const frasesTop = {
        1: ["¡El/La nº1 indiscutible! 👑", "¡Insuperable! 😎", "¡Leyenda viviente! 🏆"],
        2: ["¡Por poco le gana al primero! 😅", "¡Seguro el próximo mes es suyo! 🥈", "¡Merecido segundo lugar! 🔥"],
        3: ["¡No está mal para ser bronce! 🥉", "¡Casi, casi! 😂", "¡Top 3, felicidades! 🎉"]
    }
    
    // Construimos el mensaje con nombres
    let top = `
╔═══════════════
║ ${emoji} *TOP 10 ${text.toUpperCase()} DE ${groupName.toUpperCase()}* ${emoji}
╠══════⋆★⋆═══════
║ 🥇 ${winnersInfo[0].name} - ${pickRandom(frasesTop[1])}
║ 🥈 ${winnersInfo[1].name} - ${pickRandom(frasesTop[2])}
║ 🥉 ${winnersInfo[2].name} - ${pickRandom(frasesTop[3])}
║ 4. ${winnersInfo[3].name}
║ 5. ${winnersInfo[4].name}
║ 6. ${winnersInfo[5].name}
║ 7. ${winnersInfo[6].name}
║ 8. ${winnersInfo[7].name}
║ 9. ${winnersInfo[8].name}
║ 10. ${winnersInfo[9].name}
╚═════════════════
*¡Ranking oficial del grupo!* 🎮`.trim()

    // Enviamos el mensaje con menciones (opcional)
    conn.sendMessage(m.chat, { 
        text: top, 
        mentions: winners.map(user => user.id), // Menciona a los usuarios
        contextInfo: {
            externalAdReply: {
                title: `TOP 10 ${text.toUpperCase()} DE ${groupName}`,
                body: "Ranking oficial del grupo",
                thumbnailUrl: "https://i.imgur.com/JQH8ZnA.png"
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
