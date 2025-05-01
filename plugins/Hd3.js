import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command }) => {
  const msgData = m.quoted || m
  const mime = msgData.mimetype || (msgData.msg ? msgData.msg.mimetype : '')

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    throw `[❗️] Debes enviar o responder a una imagen válida (JPG o PNG) usando: ${usedPrefix + command}`
  }

  const imageData = await msgData.download()
  if (!imageData) throw "❌ No se pudo descargar la imagen."

  const imageUrl = await uploadImage(imageData)
  const apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`

  await conn.sendMessage(m.chat, { react: { text: '🔄', key: m.key } })

  try {
    await conn.sendMessage(m.chat, {
      image: { url: apiUrl },
      caption: `🛠️ *HD Completado*\n\nTu imagen se ha mejorado con éxito.`
    }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    throw `❌ Error al procesar la imagen.\n\n${err}`
  }
}

handler.command = /^hd3$/i
handler.tags = ['herramientas'] // Esto hará que aparezca en la categoría correspondiente
handler.help = ['hd'] // Se mostrará en el menú como: • hd

export default handler
