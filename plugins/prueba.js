import axios from 'axios';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  if (!chat.simi) return true;

  const textodem = m.text.toLowerCase();

  // ⛔ Ignorar comandos
  if (/^[.!/#]/.test(textodem)) return;

  // ⛔ Ignorar palabras clave de comandos
  const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
  const words = textodem.split(/\s+/);
  if (excludedWords.some(word => words.includes(word))) return;

  // ✅ Palabras o frases que indican emoción o conversación
  const emocionesClave = [
    'estoy triste', 'me siento solo', 'feliz', 'contento', 'enojado', 'molesto',
    'emocionado', 'deprimido', 'aburrido', 'ansioso', 'preocupado', 'tengo miedo',
    'me gusta', 'odio', 'me encantó', 'llorando', 'riendo', 'necesito hablar'
  ];

  // ✅ Menciona al bot o transmite una emoción
  const mencionBot = /(barbozabot|barboza|bot)/i.test(textodem);
  const contieneEmocion = emocionesClave.some(palabra => textodem.includes(palabra));

  if (!mencionBot && !contieneEmocion) return;

  try {
    const username = `${conn.getName(m.sender)}`;
    const basePrompt = `Tu nombre es BarbozaBot, creado por BotBarboza-Ai. Hablas español y eres amigable, curioso y divertido. Siempre respondes con empatía, especialmente cuando alguien expresa emociones como tristeza, felicidad o ansiedad. Llamas a las personas por su nombre: ${username}.`;

    const prompt = `${basePrompt} Responde a este mensaje: ${m.text}`;

    const response = await callBarbozaAPI(m.text, username, prompt);

    await conn.reply(m.chat, response, m);
  } catch (error) {
    console.error('Error en handler Luminai:', error);
    await conn.reply(m.chat, '❌ Ocurrió un error al procesar tu mensaje', m);
  }

  return !0;
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
