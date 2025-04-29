import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  // Solo respondemos si el chat tiene SIMI activado
  if (chat?.simi) {
    // Ignora comandos que comienzan con "!"
    if (/^[!]/.test(m.text)) return;

    const textodem = m.text;

    try {
      const username = await conn.getName(m.sender);
      const basePrompt = `Tu nombre es EliteBotBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Responde a los mensajes que manden en el chat no exageradamente. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;
      const prompt = `${basePrompt}. Responde lo siguiente: ${textodem}`;

      // Llama a la API Luminai
      console.log('📡 Llamando a Luminai...');
      const response = await callBarbozaAPI(textodem, username, prompt);
      console.log('✅ Respuesta Luminai:', response);

      // Verifica que el socket esté activo (forma más segura)
      if (!conn.user || conn.socket?.readyState !== 1) {
        console.error('❌ WhatsApp no está conectado.');
        return;
      }

      // Envía la respuesta al chat
      await conn.reply(m.chat, response, m);
    } catch (error) {
      console.error('❌ Error en handler Luminai:', error);
      try {
        await conn.reply(m.chat, '❌ Ocurrió un error al procesar tu mensaje.', m);
      } catch (err) {
        console.error('❌ Error al enviar mensaje de error:', err);
      }
    }

    return !0; // No continuar con otros handlers
  }

  return true; // Continuar si SIMI no está activo
};

export default handler;

// 📡 Función que llama a tu API Luminai
async function callBarbozaAPI(query, username, prompt) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: query,
      user: username,
      prompt: prompt,
      webSearchMode: false
    }, {
      timeout: 10000 // Espera máxima de 10 segundos
    });

    return response.data.result?.trim() || '💛 Lo siento, no pude responder eso.';
  } catch (error) {
    console.error('💛 Error al obtener respuesta de Luminai:', error);
    return '💛 Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.';
  }
}
