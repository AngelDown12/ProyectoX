import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  // Solo respondemos si el chat tiene SIMI activado
  if (chat.simi) {

    // Si el mensaje es un comando (por ejemplo, comienza con "!" o algo similar), no respondemos
    if (/^[!]/.test(m.text)) return;

    let textodem = m.text;

    try {
      const username = `${conn.getName(m.sender)}`;
      const basePrompt = `Tu nombre es EliteBotBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Responde a los mensajes que manden en el chat no exageradamente. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;
      const prompt = `${basePrompt}. Responde lo siguiente: ${textodem}`;

      const response = await callBarbozaAPI(textodem, username, prompt);

      // Verifica que el socket esté activo antes de responder
      if (!conn.user || conn.ws?.state !== 'open') {
        console.error('Conexión de WhatsApp no disponible al intentar responder.');
        return;
      }

      try {
        await conn.reply(m.chat, response, m);
      } catch (e) {
        console.error('❌ Error al responder con conn.reply:', e);
      }
    } catch (error) {
      console.error('Error en handler Luminai:', error);
      try {
        await conn.reply(m.chat, '❌ Ocurrió un error al procesar tu mensaje', m);
      } catch (e) {
        console.error('❌ Error al enviar mensaje de error:', e);
      }
    }

    return !0; // Evita que el bot siga procesando el mensaje
  }

  return true; // Continúa con la ejecución normal si SIMI no está activo
};

export default handler;

// Función para interactuar con tu API
async function callBarbozaAPI(query, username, prompt) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: query,
      user: username,
      prompt: prompt,
      webSearchMode: false
    }, {
      timeout: 10000 // Tiempo máximo de espera: 10 segundos
    });

    return response.data.result?.trim() || '💛 Lo siento, no pude responder eso.';
  } catch (error) {
    console.error('💛 Error al obtener respuesta de Luminai:', error);
    return '💛 Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.';
  }
}
