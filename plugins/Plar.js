import yts from 'yt-search'
import { youtubedl, youtubedlv2, youtubedl2 } from '@bochilteam/scraper'
import ytdl from 'ytdl-core'

const limit = 200 * 1024 * 1024
const handler = async (m, { conn, command, text, args }) => {
  if (!text) return m.reply(`Ejemplo de uso:\n${command} Bad Bunny - Monaco`)

  let search = await yts(text)
  let list = search.videos
  if (!list.length) return m.reply('No se encontraron resultados')

  let doc = {
    audio: 'audio/mpeg',
    video: 'video/mp4',
    document: 'application/octet-stream'
  }

  let vid = list.find(video => video.seconds < 3600)
  if (!vid) vid = list[0]
  let { title, timestamp, ago, url, views, ago: publishedTime, thumbnail } = vid

  let yt = ''
  try {
    if (command == 'play') yt = await youtubedl(url)
    else if (command == 'play2') yt = await youtubedlv2(url)
    else if (command == 'play3') yt = await youtubedl2(url)
    else if (command == 'play4') {
      const info = await ytdl.getInfo(url)
      const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
      yt = { audio: { url: format.url, size: format.contentLength }, title: info.videoDetails.title }
    }
  } catch (e) {
    console.log(e)
    return m.reply('Error al obtener datos del video.')
  }

  if (!yt.audio.url) return m.reply('No se pudo obtener el audio.')

  const isLimited = yt.audio.size && yt.audio.size > limit
  const caption = `
▢ *Título:* ${title}
▢ *Duración:* ${timestamp}
▢ *Publicado:* ${publishedTime}
▢ *Vistas:* ${views}
▢ *Link:* ${url}
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption,
    footer: `Audio: ${yt.audio.size ? (yt.audio.size / 1024 / 1024).toFixed(2) + ' MB' : 'desconocido'}`,
    buttons: [
      { buttonId: `${command}audio ${url}`, buttonText: { displayText: 'Audio' }, type: 1 },
      { buttonId: `${command}video ${url}`, buttonText: { displayText: 'Video' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
}
handler.command = /^play4?|play3?|play2?$/i
handler.register = true
export default handler
