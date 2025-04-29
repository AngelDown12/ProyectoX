import util from 'util'
import path from 'path'

let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
    if (!text) return m.reply(`🎮 *Uso correcto:*\n${usedPrefix}top <texto>`)
    
    let ps = groupMetadata.participants.map(v => v.id)
    let winners = Array.from({length: 10}, () => ps.getRandom())
    
    // Elementos gaming
    const gameEmojis = ['🎮', '🕹️', '👾', '🎯', '🏆', '⚔️', '🛡️', '💣', '🔫', '🧩', '🎲', '👑', '💎', '🔥', '⭐']
    const gameThemes = [
        'RANKING DE JUGADORES', 
        'TABLA DE PUNTUACIONES', 
        'CLASIFICACIÓN ÉPICA', 
        'TOP GAMERS', 
        'LEADERBOARD'
    ]
    
    let k = Math.floor(Math.random() * 70)
    let x = pickRandom(gameEmojis)
    let theme = pickRandom(gameThemes)
    let vn = `https://hansxd.nasihosting.com/sound/sound${k}.mp3`
    
    // Diseño estilo gaming
    let top = `
╔═══════════════════════
║ 🎮 *${theme}: ${text.toUpperCase()}* 🎮
╠═══════════⋆★⋆═════════
║ 🥇 ${user(winners[0])}
║ 🥈 ${user(winners[1])}
║ 🥉 ${user(winners[2])}
║ 4. ${user(winners[3])}
║ 5. ${user(winners[4])}
║ 6. ${user(winners[5])}
║ 7. ${user(winners[6])}
║ 8. ${user(winners[7])}
║ 9. ${user(winners[8])}
║ 10. ${user(winners[9])}
╚═══════════════════════
🎮 *Felicidades a los top players!* 🎮`.trim()

    // Enviar con mención y posiblemente el audio
    conn.sendMessage(m.chat, { 
        text: top, 
        mentions: winners,
        contextInfo: {
            externalAdReply: {
                title: `🏆 TOP 10 ${text.toUpperCase()} 🏆`,
                body: "Ranking oficial del grupo",
                thumbnailUrl: "https://i.imgur.com/7XVY7lJ.png" // Puedes cambiar por una imagen gaming
            }
        }
    })
    
    // Opcional: enviar sonido gaming
    // conn.sendMessage(m.chat, { audio: { url: vn }, mimetype: 'audio/mp4' }, { quoted: m })
}

handler.help = handler.command = ['topp', 'ranking', 'leaderboard']
handler.tags = ['games', 'fun']
handler.group = true
export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
