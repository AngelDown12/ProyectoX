import fetch from 'node-fetch';
import axios from 'axios'; // Se añade axios porque Luminai lo requiere

const handler = (m) => m;

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat];
  if (chat.simi) {
    if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
    let textodem = m.text;
    if (m.text.includes('serbot') || m.text.includes('bots') || m.text.includes('jadibot') || m.text.includes('menu') || m.text.includes('play') || m.text.includes('play2') || m.text.includes('playdoc') || m.text.includes('tiktok') || m.text.includes('facebook') || m.text.includes('menu2') || m.text.includes('infobot') || m.text.includes('estado') || m.text.includes('ping') || m.text.includes('instalarbot') || m.text.includes('sc') || m.text.includes('sticker') || m.text.includes('s') || m.text.includes('wm') || m.text.includes('qc')) return
    if (m.fromMe) return
    try {
      await conn.sendPresenceUpdate('composing', m.chat)
      const username = m.pushName || 'Usuario'
      const basePrompt = `Tu nombre es BarbozaBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explociones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`
      const prompt = `${basePrompt}. Responde lo siguiente: ${textodem}`
      const response = await axios.post("https://Luminai.my.id", {
        content: textodem,
        user: username,
        prompt: prompt,
        webSearchMode: false
      })
      await m.reply(response.data.result)
    } catch (e) {
      console.error('💛 Error con Luminai:', e)
      await m.reply('Error al obtener respuesta de la IA. Intenta más tarde.')
    }
    return !0;
  }
  return true;
};

export default handler;
