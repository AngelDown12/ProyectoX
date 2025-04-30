import fetch from 'node-fetch'
import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

let handler = async (m, { conn }) => {
  let user = m.sender
  let pp = './tmp/gay_' + user + '.png'

  try {
    let img = await conn.profilePictureUrl(user, 'image').catch(_ => null)
    if (!img) throw 'No pude obtener tu foto de perfil'

    let avatar = await loadImage(await (await fetch(img)).buffer())
    let overlay = await loadImage('https://i.imgur.com/1VeywGJ.png') // bandera gay transparente

    let canvas = createCanvas(avatar.width, avatar.height)
    let ctx = canvas.getContext('2d')

    ctx.drawImage(avatar, 0, 0)
    ctx.drawImage(overlay, 0, 0, avatar.width, avatar.height)

    fs.writeFileSync(pp, canvas.toBuffer())

    await conn.sendFile(m.chat, pp, 'gay.png', `Aquí tienes tu versión gay!`, m)
    fs.unlinkSync(pp)
  } catch (e) {
    console.error(e)
    m.reply('Error al generar la imagen.')
  }
}

handler.command = /^gay3$/i
handler.tags = ['fun']
handler.help = ['gay3']

export default handler
