import axios from 'axios';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  // Si SIMI está activado para este chat
  if (chat.simi) {
    const textodem = m.text;

    // ⛔ Ignorar si es comando (empieza con . ! / etc.)
    if (/^[.!/#]/.test(textodem)) return;

    // ⛔ Ignorar si contiene palabras clave que son comandos
    const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
    const words = textodem.toLowerCase().split(/\s+/);
    if (excludedWords.some(word => words.includes(word))) return;

    // ✅ Solo responde si mencionan al bot (opcional, puedes cambiar las palabras clave)
    const activarPorMencion = /(barbozabot|barboza|bot)/i;
    if (!activarPorMencion.test(textodem)) return;

    try {
      const username = `${conn.getName(m.sender)}`;
      const basePrompt = `Tu nombre es BarbozaBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;

      const prompt = `${basePrompt}. Responde lo siguiente: ${textodem}`;

      const response = await callBarbozaAPI(textodem, username, prompt);

      await conn.reply(m.chat, response, m);
    } catch (error) {
      console.error('Error en handler Luminai:', error);
      await conn.reply(m.chat, '❌ Ocurrió un error al procesar tu mensaje', m);
    }
    return !0;
  }
  return true;
};

export default handler;

// Función para interactuar con la API
async function callBarbozaAPI(query, username, prompt) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: query,
      user: username,
      prompt: prompt,
      webSearchMode: false
    });

    if (response.status === 200 && response.data.result) {
      return response.data.result.trim() || '💛 Lo siento, no pude responder eso.';
    } else {
      return '💛 Lo siento, hubo un problema con la respuesta de la API.';
    }
  } catch (error) {
    console.error('💛 Error al obtener respuesta de Luminai:', error);
    return '💛 Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.';
  }
}
