import fetch from 'node-fetch';
import axios from 'axios'; // Se añade axios porque Luminai lo requiere

const handler = (m) => m;

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat];
  if (chat.simi) {
    // Verifica si el mensaje tiene menos de 20 palabras o si es un comando
    const wordCount = m.text.split(/\s+/).length;
    if (wordCount < 20 || m.text.startsWith('/') || m.text.startsWith('!') || m.text.startsWith('.')) return;

    let textodem = m.text;
    
    // Eliminé la lista de palabras bloqueadas para que responda más mensajes
    if (m.fromMe) return;
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
      console.error('💛 Error con Luminai:', e); // Solo se muestra en la consola
    }
    return !0;
  }
  return true;
};

export default handler;
