import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  if (chat.simi) {
    if (/^[!/#.]/.test(m.text)) return;

    const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
    const words = m.text.toLowerCase().split(/\s+/);
    if (excludedWords.some(word => words.includes(word))) return;

    // 👉 Lista reducida a palabras clave individuales
    const palabrasClave = [
      // Emociones
      'triste', 'mal', 'solo', 'llorar', 'deprimido', 'ansiedad', 'estresado', 'nervioso', 'miedo',
      'preocupado', 'inseguro', 'ignorado', 'amigos', 'rechazado', 'feliz', 'bien', 'mejor', 'contento',
      'agradecido', 'emocionado', 'motivado', 'energía', 'poderoso', 'afortunado', 'amado', 'paz',
      'libre', 'sonriendo', 'compartir', 'bonito', 'abrazo', 'amor', 'enamorado', 'necesito', 'extraño',
      'celos', 'rompí', 'gracias', 'consejo', 'ayuda', 'piensas', 'curioso', 'interesante', 'escuchar',
      'aburrido', 'reír', 'chiste', 'gracioso', 'planeta', 'desastre', 'raro', 'drama',
      'hola', 'buenos', 'buenas', 'noches', 'tardes', 'días', 'cómo', 'tal', 'encajo', 'sentido', 'vida',

      // Palabras relacionadas con EliteBot
      'elitebot', 'elite', 'bot', 'global', 'asistente',

      // Palabras de gaming / Free Fire
      'free', 'fire', 'booyah', 'rush', 'campero', 'pared', 'gloo', 'escuadra', 'duo', 'pvp',
      'insano', 'ruleta', 'recarga', 'doble', 'diamantes', 'sala', 'heroico', 'gran', 'maestro', 'headshot',
      'zona', 'azul', 'emote', 'bajaron', 'reviveme', 'rushean', 'campean', 'sniper', 'mp40', 'scar',
      'm1014', 'disparan', 'macro', 'manco', 'rojo', 'estafaron', 'banearon', 'pase', 'elite', 'jugar',
      'jugamos', 'salió', 'skin', 'giré', 'evento', 'recargar', 'clasificatoria', 'entrenamiento', 'clan',
      'escuadra', 'id', 'platino', 'personaje', 'alturas', 'macro', 'activado'
    ];

    // Si al menos una palabra de las escritas por el usuario coincide
    const mensajePalabras = m.text.toLowerCase().split(/\s+/);
    const activarRespuesta = mensajePalabras.some(p => palabrasClave.includes(p));
    if (!activarRespuesta) return;

    try {
      const username = conn.getName(m.sender);
      const basePrompt = `Tu nombre es Elite Bot Global, un asistente creado por BotBarboza-Ai. Hablas en Español. Llamas a las personas por su nombre (${username}), eres divertido, curioso, y muy sociable. Lo más importante es que seas amigable, empático y que interactúes con inteligencia emocional.`;

      const prompt = `${basePrompt} Responde a este mensaje de forma amigable: ${m.text}`;

      const response = await callBarbozaAPI(m.text, username, prompt);
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

async function callBarbozaAPI(query, username, prompt) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: query,
      user: username,
      prompt: prompt,
      webSearchMode: false
    });

    return response.data.result?.trim() || '💛 Lo siento, no pude responder eso.';
  } catch (error) {
    console.error('💛 Error al obtener respuesta de Luminai:', error);
    return '💛 Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.';
  }
}
