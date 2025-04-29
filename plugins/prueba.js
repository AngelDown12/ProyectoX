import axios from 'axios';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  // Si SIMI está activado para este chat
  if (chat.simi) {

    // Aquí evitamos que SIMI responda a comandos específicos
    if (/^.*false|disable|(turn)?off|0|!/.test(m.text)) return;  // Evitar comandos como !, off, 0, etc.

    let textodem = m.text;

    // Lista de palabras excluidas para evitar que SIMI responda a ciertos comandos
    const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];

    const words = textodem.toLowerCase().split(/\s+/);

    // Si la palabra está en la lista de excluidos, no responde
    if (excludedWords.some(word => words.includes(word))) return;

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
    return !0;  // Esto evita que el bot siga procesando el mensaje
  }
  return true;  // Continúa con la ejecución normal si SIMI no está activo
};

export default handler;

// Función para interactuar con tu API
async function callBarbozaAPI(query, username, prompt) {
  try {
    console.log('Datos enviados a la API:', {
      content: query,
      user: username,
      prompt: prompt,
      webSearchMode: false
    });

    const response = await axios.post("https://Luminai.my.id", {
      content: query,
      user: username,
      prompt: prompt,
      webSearchMode: false
    });

    // Verificar la respuesta de la API
    if (response.status === 200 && response.data.result) {
      return response.data.result.trim() || '💛 Lo siento, no pude responder eso.';
    } else {
      console.error('Respuesta inesperada de la API:', response);
      return '💛 Lo siento, hubo un problema con la respuesta de la API.';
    }
  } catch (error) {
    console.error('💛 Error al obtener respuesta de Luminai:', error);
    console.error('Detalles del error:', error.response?.data); // Imprimir más detalles del error si están disponibles
    return '💛 Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.';
  }
}
