import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

const colores = {
  azul: ['#00B4DB', '#0083B0'],
  rojo: ['#F44336', '#FFCDD2'],
  verde: ['#4CAF50', '#C8E6C9']
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const color = colores[args[0]] || colores.azul
  const text = colores[args[0]] ? args.slice(1).join(' ') : args.join(' ')
  if (!text) return m.reply(`Usa: *${usedPrefix + command} [color] tu texto*\nColores: azul, rojo, verde`)

  const avatar = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
  const canvas = createCanvas(1080, 1080)
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
  grad.addColorStop(0, color[0])
  grad.addColorStop(1, color[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1080)

  const img = await loadImage(avatar)
  ctx.drawImage(img, 40, 40, 200, 200)

  ctx.font = 'bold 60px Sans-serif'
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 300, 150)

  const file = `./tmp/${Date.now()}.png`
  fs.writeFileSync(file, canvas.toBuffer('image/png'))
  await conn.sendMessage(m.chat, { image: { url: file }, caption: 'Texto generado' }, { quoted: m })
  fs.unlinkSync(file)
}

handler.command = ['texto']
handler.help = ['texto [color] texto']
handler.tags = ['fun']
export default handler
