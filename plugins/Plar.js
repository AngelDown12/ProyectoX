import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { youtubedl, youtubedlv2, youtubedl2 } from '@bochilteam/scraper'

const limit = 200 * 1024 * 1024 // 200MB
const handler = async (m, { conn, command, text, args, usedPrefix }) => {
  if (!text) throw `Ejemplo de uso:\n${usedPrefix + command} calvin harris`

  await m.reply(wait)

  let vid, res, q = text

  try {
    const results = await yts(q)
    const list = results.videos
    if (!list.length) throw 'No se encontraron resultados.'

    // Obtener el primer resultado válido
    vid = list.find(video => video.seconds < 3600) || list[0]
    if (!vid) throw 'Video no válido o demasiado largo.'

    const { title, url, duration, thumbnail } = vid
    const caption = `
*➤ Título:* ${title}
*➤ Duración:* ${duration.timestamp}
*➤ URL:* ${url}
*➤ Tamaño máx:* ${limit / 1024 / 1024} MB
`.trim()

    // Elegir la fuente según el comando
    let dl = null
    switch (command) {
      case 'play':
        dl = await youtubedl(url).catch(() => null)
        break
      case 'play2':
        dl = await youtubedlv2(url).catch(() => null)
        break
      case 'play3':
        dl = await youtubedl2(url).catch(() => null)
        break
      case 'play4':
        const info = await ytdl.getInfo(url)
        const audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
        dl = {
          audio: { url: audio.url, size: audio.contentLength },
          title: info.videoDetails.title
        }
        break
    }

    if (!dl?.audio?.url) throw 'Error al obtener el audio.'

    // Enviar preview + botones
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: caption,
      buttons: [
        { buttonId: `${usedPrefix}playaudio ${url}`, buttonText: { displayText: 'Audio' }, type: 1 },
        { buttonId: `${usedPrefix}playvideo ${url}`, buttonText: { displayText: 'Video' }, type: 1 }
      ],
      footer: 'Selecciona una opción',
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    throw 'Ocurrió un error al procesar tu solicitud.'
  }
}

handler.help = ['play', 'play2', 'play3', 'play4'].map(c => c + ' <texto>')
handler.tags = ['downloader']
handler.command = /^play4?|play3?|play2?$/i
handler.limit = 1

export default handler
