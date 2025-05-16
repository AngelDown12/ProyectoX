// plugins/_owner-check.js

let handler = async (m, { conn, command }) => {
  m.reply('¡Eres el owner! Puedes usar este comando.')
}
handler.command = /^ownercheck$/i

// Aquí defines tu número de owner con código de país, sin @
handler.owner = true

export default handler
