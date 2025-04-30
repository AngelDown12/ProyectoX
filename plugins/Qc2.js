import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

const colores = {
  rojo: ['#F44336', '#FFCDD2'],
  azul: ['#00B4DB', '#0083B0'],
  verde: ['#4CAF50', '#C8E6C9'],
  rosa: ['#E91E63', '#F8BBD0'],
  morado: ['#9C27B0', '#E1BEE7'],
  negro: ['#212121', '#9E9E9E'],
  naranja: ['#FF9800', '#FFE0B2'],
  gris: ['#607D8B', '#CFD8DC'],
  celeste: ['#00FFFF', '#E0FFFF'],
  dorado: ['#FFD700', '#FFF8DC'],
  vino: ['#800000', '#C08080'],
  aqua: ['#7fdbff', '#c0f9ff']
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const colorElegido = args[0]?.toLowerCase()
  const gradColors = colores[colorElegido] || colores['azul']
  const texto = colores[colorElegido] ? args.slice(1).join(' ') : args.join(' ') || m.quoted?.text

  if (!texto) {
    const listaColores = Object.keys(colores).join(', ')
    return m.reply(`✏️ *Usa el comando así:*\n\n*${usedPrefix + command} [color] tu mensaje*\n\n*Ejemplo:*\n${usedPrefix + command} rosa Hola grupo\n\n*Colores disponibles:*\n${listaColores}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

  let avatar = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
  try {
    avatar = await conn.profilePictureUrl(m.sender, 'image')
  } catch {}

  const canvas = createCanvas(1080, 1080)
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
  grad.addColorStop(0, gradColors[0])
  grad.addColorStop(1, gradColors[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1080)

  const img = await loadImage(avatar)
  ctx.save()
  ctx.beginPath()
  ctx.arc(100, 100, 80, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(img, 20, 20, 160, 160)
  ctx.restore()

  ctx.font = 'bold 40px Sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(m.pushName || 'Usuario', 220, 100)

  ctx.font = 'bold 55px Sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'

  const palabras = texto.split(' ')
  let linea = '', lineas = []
  for (const palabra of palabras) {
    const test = linea + palabra + ' '
    if (ctx.measureText(test).width > 850) {
      lineas.push(linea.trim())
      linea = palabra + ' '
    } else {
      linea = test
    }
  }
  if (linea.trim()) lineas.push(linea.trim())

  const startY = 500 - (lineas.length * 30)
  lineas.forEach((l, i) => {
    ctx.fillText(l, 540, startY + (i * 70))
  })

  const logo = await loadImage('https://cdn.russellxz.click/a46036ec.png')
  ctx.drawImage(logo, 900, 900, 140, 140)

  const filePath = `./tmp/texto-${Date.now()}.png`
  const out = fs.createWriteStream(filePath)
  canvas.createPNGStream().pipe(out)

  out.on('finish', async () => {
    await conn.sendMessage(m.chat, {
      image: { url: filePath },
      caption: `🖼 Generado por Azura Ultra & Cortana Bot`
    }, { quoted: m })
    fs.unlinkSync(filePath)
  })
}

handler.command = ['texto']
handler.help = ['texto [color] texto']
handler.tags = ['fun']
handler.register = true

export default handler
