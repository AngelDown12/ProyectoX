import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

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
      const basePrompt = `Tu nombre es Elite Bot Global y parece haber sido creado por Elite-Global-AI. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;

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

// Palabras clave para emociones de tristeza y Elite Bot
const palabrasClave = [
  // Tristeza
  'triste', 'deprimido', 'mal', 'llorar', 'soledad', 'dolor', 'pena', 'angustia', 'desilusión',
  'aburrido', 'ansiedad', 'miedo', 'pánico', 'nervios', 'preocupado', 'confusión', 'frustración',
  'cansado', 'vacío', 'rechazado', 'ignorado', 'enojo', 'rabia', 'furia', 'ira', 'indignado',
  'celoso', 'culpa', 'vergüenza', 'insomnio', 'inseguro', 'nostalgia', 'extraño', 'rompí', 'fallé',
  'necesito', 'perdón', 'ayuda', 'consejo', 'curioso', 'escuchar', 'confianza', 'esperanza', 'superar',
  'curarme', 'salud', 'motivación', 'superación', 'amor', 'amado', 'querido', 'romántico', 'cariño',
  'amistad', 'compañía', 'abrazo', 'beso', 'paz', 'libertad', 'calma', 'tranquilidad', 'felicidad',
  'alegría', 'risa', 'contento', 'satisfacción', 'éxito', 'orgullo', 'fuerza', 'energía', 'positivo',
  'optimismo', 'gratitud', 'bendición', 'bonito', 'hermoso', 'felicitación', 'entusiasmo',
  'agradecido', 'esperando', 'viviendo', 'intentando', 'mejorando', 'disfrutar', 'momento', 'vida',
  'vivir', 'respirar', 'sentir', 'aprender', 'crecer', 'encuentro', 'alma', 'corazón', 'esperar',
  'necesario', 'ganas', 'vulnerable', 'lleno', 'equilibrio', 'valentía',

  // Palabras relacionadas con Elite Bot
  'elitebot', 'elite bot', 'global bot', 'elitebot global', 'global', 'bot global',
  'bot elite', 'botelite', 'elite', 'elites', 'elite AI', 'eliteai', 'elite bot global', 
  'elitebotgame', 'elitebotgaming', 'elitebotfi', 'elitebots', 'elitebotworld', 
  'elite bot 24/7', 'elite bot servicio', 'elitebot servicio', 'elite bot tecnología',
  'boteliteglobal', 'bots elite', 'elite bots', 'elite AI bot', 'elitebotmaster', 
  'elitebotpower', 'bot Elite-Global', 'EliteBotMaster', 'elitegamebot', 'elitebotplayer',
  'elitebotteam', 'elitebotfans', 'elitebot community', 'elitebot player', 'elitebot squad'
];
