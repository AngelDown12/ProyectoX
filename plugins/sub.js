import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

const handler = async (m, { conn, usedPrefix }) => {
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(
            m.chat,
let handler = async (m, { conn, usedPrefix }) => {
    if (global.conn.user.jid !== conn.user.jid) return m.reply('*[❗] Este comando solo puede ser usado en el Bot principal*')
    
    const GataBotDir = './GataJadiBot/';
    let count = 0;
    
    // Verificar si el directorio existe
    if (!existsSync(GataBotDir)) {
        return m.reply('*[❗] No se encontró el directorio de sesiones de SubBots*')
    }
    
    try {
        // Leer el directorio de sesiones
        const files = readdirSync(GataBotDir)
        
        // Iterar sobre cada carpeta de sesión
        for (const file of files) {
            const filePath = path.join(GataBotDir, file)
            
            // Verificar si es un directorio
            if (statSync(filePath).isDirectory()) {
                const credsPath = path.join(filePath, 'creds.json')
                
                // Verificar si existe el archivo creds.json
                if (existsSync(credsPath)) {
                    try {
                        // Intentar eliminar el archivo creds.json
                        unlinkSync(credsPath)
                        count++
                        
                        // Intentar eliminar el directorio completo
                        rmSync(filePath, { recursive: true, force: true })
                    } catch (error) {
                        console.error(`Error al eliminar ${filePath}:`, error)
                    }
                }
            }
        }
        
        if (count === 0) return m.reply('*[❗] No se encontraron sesiones de SubBots para limpiar*')
        m.reply(`*[✅] Se limpiaron ${count} sesiones de SubBots*\n\n*[❗] Los SubBots deberán volver a escanear el código QR*`)
        
    } catch (err) {
        console.error('Error al limpiar sesiones:', err)
        m.reply('*[❗] Ocurrió un error al limpiar las sesiones de SubBots*\n\n*[❗] Revise la consola para más detalles*')
    }
}

handler.help = ['limpiezasub']
handler.tags = ['jadibot']
handler.command = /^(limpiezasub|limpiarsub|clearsubbot)$/i
handler.owner = true
handler.fail = null

export default handler 
