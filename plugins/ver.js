let handler = async (m, { conn, text, isROwner, isOwner }) => {
  let fkontak = {
    key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
    message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
    participant: "0@s.whatsapp.net"
  }

  if (!text.includes('http')) throw `⚠️ Debes incluir un mensaje y un link de imagen.\n\nEjemplo:\n.setwel Bienvenido @user al grupo @subject https://imagen.jpg`

  let split = text.trim().split(' ')
  let link = split.pop()
  let message = split.join(' ')

  if (!link.startsWith('http')) throw `⚠️ El último valor debe ser un link válido de imagen.\nEjemplo:\n.setwel Hola @user bienvenido https://imagen.jpg`

  global.db.data.chats[m.chat].sWelcome = message
  global.db.data.chats[m.chat].sWelcomeImg = link

  conn.reply(m.chat, '✅ Mensaje de bienvenida y link de imagen establecidos correctamente.', fkontak, m)
}

handler.command = ['setwel']
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler
