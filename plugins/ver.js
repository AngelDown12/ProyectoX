let handler = async (m, { args, text, command }) => {
  if (!m.isGroup) throw '❌ Este comando solo se usa en grupos.'
  if (!text.includes('http')) throw '❌ Usa el formato: .setwel mensaje https://imagen.jpg'

  let split = text.trim().split(/https?:\/\//i)
  if (split.length < 2) throw '❌ Formato incorrecto. Debe tener un mensaje y una imagen.'

  let mensaje = split[0].trim()
  let image = 'https://' + split[1].trim()
  let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

  chat.customWelcome = mensaje
  chat.customWelcomeImage = image

  m.reply(`✅ Bienvenida personalizada configurada:\n\n📝 *Mensaje:* ${mensaje}\n🖼 *Imagen:* ${image}`)
}
handler.command = ['setwel']
handler.admin = true
handler.group = true
export default handler
