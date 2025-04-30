import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const botname = 'LuminAI'
  const vs = '1.0.0'
  const emoji = '✨'
  const emoji2 = '⌛'
  const done = '✅'
  const error = '❌'
  const msm = '[Sistema]'

  const username = await conn.getName(m.sender)
  const basePrompt = `Tu nombre es ${botname} y parece haber sido creada por kevin. Tu versión actual es ${vs}, tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertida, y te encanta aprender. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`

  const quoted = m.quoted || m.msg
  const isQuotedImage = quoted?.mimetype?.startsWith('image/')

  if (isQuotedImage) {
    try {
      const img = await quoted.download()
      if (!img) throw 'No se pudo descargar la imagen'

      const content = `${emoji} ¿Qué se observa en la imagen?`
      const imageAnalysis = await fetchImageBuffer(content, img)

      if (!imageAnalysis?.result) throw 'Análisis vacío'

      const query = `${emoji} Descríbeme la imagen y detalla por qué actúan así. También dime quién eres`
      const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
      const description = await luminsesi(query, username, prompt)

      await conn.reply(m.chat, description, m)
    } catch (e) {
      console.error(e)
      await m.react(error)
      await conn.reply(m.chat, '✘ ChatGpT no pudo analizar la imagen.', m)
    }
  } else {
    if (!text) {
      return conn.reply(m.chat, `${emoji} Ingresa una petición para que ChatGpT la responda.`, m)
    }

    await m.react('🗣️')
    try {
      const { key } = await conn.sendMessage(m.chat, {
        text: `${emoji2} ChatGPT está procesando tu petición, espera unos segundos...`
      }, { quoted: m })

      const query = text
      const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
      const response = await luminsesi(query, username, prompt)

      await conn.sendMessage(m.chat, { text: response, edit: key })
      await m.react(done)
    } catch (e) {
      console.error(e)
      await m.react(error)
      await conn.reply(m.chat, '✘ ChatGpT no puede responder a esa pregunta.', m)
    }
  }
}

handler.help = ['ia', 'chatgpt', 'luminai']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'luminai']
handler.register = true
handler.group = true // o false si quieres en privado también

export default handler

// Función para enviar una imagen y obtener el análisis (base64)
async function fetchImageBuffer(content, imageBuffer) {
  try {
    const response = await axios.post('https://Luminai.my.id', {
      content,
      imageBase64: imageBuffer.toString('base64') // enviar en base64
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (error) {
    console.error('Error al analizar imagen:', error)
    throw error
  }
}

// Función para interactuar con la IA usando prompts
async function luminsesi(content, user, prompt) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content,
      user,
      prompt,
      webSearchMode: false
    })
    return response.data.result
  } catch (error) {
    console.error('Error al obtener respuesta IA:', error)
    throw error
  }
}
