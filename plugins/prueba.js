import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = (m) => m;

handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];

  // Si SIMI está activado para este chat
  if (chat.simi) {

    // Evita responder a comandos (prefijo o palabras comunes)
    if (/^[!/#.]/.test(m.text)) return;

    // Lista de palabras que indican comandos conocidos para evitar spam
    const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
    const words = m.text.toLowerCase().split(/\s+/);
    if (excludedWords.some(word => words.includes(word))) return;

    // Lista de emociones, frases comunes y gaming (incluye Free Fire)
    const emocionesClave = [
      // Emociones negativas
      'estoy triste', 'me siento mal', 'me siento solo', 'quiero llorar', 'estoy deprimido',
      'nada tiene sentido', 'no tengo ganas', 'me siento vacío', 'me duele el alma',
      'me rompieron el corazón', 'tengo ansiedad', 'estoy estresado', 'estoy nervioso',
      'me da miedo', 'estoy preocupado', 'no puedo más', 'me siento inseguro',
      'me siento ignorado', 'no tengo amigos', 'nadie me entiende', 'me siento abandonado',
      'estoy frustrado', 'estoy confundido', 'estoy molesto', 'me siento atacado',
      'odio mi vida', 'quiero rendirme', 'me siento rechazado',

      // Emociones positivas
      'estoy feliz', 'me siento bien', 'me siento mejor', 'estoy contento',
      'estoy agradecido', 'me encanta esto', 'me gusta esto', 'estoy emocionado',
      'estoy motivado', 'tengo energía', 'me siento poderoso', 'soy afortunado',
      'me siento amado', 'estoy en paz', 'me siento libre', 'estoy sonriendo',
      'quiero compartir esto', 'qué bonito día', 'estoy agradecido por ti',

      // Amor y relaciones
      'me gusta alguien', 'estoy enamorado', 'me rechazaron', 'quiero un abrazo',
      'quiero hablar contigo', 'me gustas tú', 'te quiero', 'me importas',
      'me haces falta', 'extraño a alguien', 'tengo celos', 'te necesito',
      'rompí con mi pareja', 'me siento solo en el amor',

      // Conversación general
      'qué opinas de esto', 'puedo hablar contigo', 'quiero contarte algo',
      'tienes razón', 'eso me recuerda algo', 'me pasó lo mismo',
      'gracias por escuchar', 'qué piensas tú', 'me gustaría saber tu opinión',
      'es interesante', 'eso es curioso', 'nunca lo había pensado así',
      'me ayudas', 'necesito un consejo', 'qué harías tú',

      // Diversión y cotidianeidad
      'estoy aburrido', 'necesito reír', 'cuéntame algo', 'dime un chiste',
      'algo gracioso', 'qué haces', 'no tengo nada que hacer', 'estás ahí',
      'me haces compañía', 'me entretiene esto', 'cuéntame algo interesante',

      // Frases comunes
      'buenos días', 'buenas tardes', 'buenas noches', 'cómo estás',
      'qué tal', 'cómo te va', 'todo bien', 'todo mal',
      'aquí estoy', 'me alegra verte', 'qué haces por aquí',
      'qué bueno', 'qué mal', 'así es la vida', 'ni modo',

      // Reflexión y filosofía
      'la vida es difícil', 'la vida es bella', 'todo pasa por algo',
      'no entiendo nada', 'estoy pensando mucho', 'me cuesta decidir',
      'a veces siento que no encajo', 'la vida sigue', 'qué sentido tiene todo',

      // Humor, ironía
      'esto es una locura', 'qué risa', 'jajaja', 'estoy harto',
      'me quiero ir del planeta', 'ya no sé qué pensar', 'soy un desastre',
      'esto es raro', 'la vida me supera', 'tremendo drama',

      // Nombre del bot
      'elitebot', 'elite bot', 'elite bot global', 'hola elitebot', 'hola elite bot global',
      'oye elitebot', 'oye elite bot', 'asistente elitebot', 'elitebot estás ahí', 'ey elitebot',
      'elite bot ayuda', 'elitebot dime algo', 'elite bot responde esto'
    ];

    const palabrasGaming = [
      'free fire', 'ff', 'booyah', 'rush', 'campero', 'pared gloo', 'escuadra', 'mi duo',
      'pvp', '1vs1', 'insano', 'ruleta mágica', 'recarga doble', 'diamantes', 'sala personalizada',
      'heroico', 'gran maestro', 'kappa', 'headshot', 'vs random', 'zona azul', 'pared agachada',
      'emote', 'emotiza', 'me bajaron', 'reviveme', 'te tumbaron', 'me rushean', 'me campean',
      'me cargaron', 'sniper', 'mp40', 'ak', 'scar', 'm1014', 'me disparan', 'donde están',
      'juega bien', 'no camperes', 'duo tóxico', 'duo perfecto', 'quién tiene sala',
      'me haces pvp', 'quiero recargar', 'me regalaron pase', 'cuál es tu id', 'regálame diamantes',
      'me toco la incubadora', 'nuevo pase', 'quién juega', 'vamos a jugar', 'te invito',
      'soy heroico', 'baje a platino', 'me subieron', 'andamos ready', 'ando en clasificatoria',
      'estás en entrenamiento', 'clan activo', 'busco escuadra', 'me estafaron', 'me banearon',
      'nuevo evento', 'cuánto recargaste', 'me mataron', 'hay hacker', 'usa macro',
      'no sean mancos', 'puro rojo', 'buen pvp', 'la rompiste', 'estás rotísimo', 'macro activado',
      'me tocó skin', 'ojalá me saliera', 'giré la ruleta', 'me sacaron skin', 'salió mi personaje',
      'me estafó garena', 'evento de recarga', 'pase elite', 'me dieron la tabla',
      'me eliminaron', 'cuidado con zona', 'tenemos la altura', 'juega con cabeza', 'modo insano'
    ];

    const activarRespuesta = emocionesClave.concat(palabrasGaming).some(p => m.text.toLowerCase().includes(p));
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
