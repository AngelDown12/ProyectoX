import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  // Elimina "bard" o "gemini" del mensaje (incluyendo si lleva punto)
  const query = m.text.replace(/^[\.]?(bot|gemini)\s*/i, '').trim();
  
  if (!query) throw `¡Hola! ¿En qué te puedo ayudar? ♥️`;

  try {
    await m.react('🔄'); // Opcional: reacción de carga
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    await m.reply(data.result || '🔴 Sin respuesta de la API');
  } catch (e) {
    await m.react('❌');
    await m.reply('*Error al procesar la solicitud*');
    console.error(e);
  }
};

// Configuración IDÉNTICA a tu comando "estado"
handler.customPrefix = /^(\.)?(bot|gemini)/i; // Detecta .bard, bard, .gemini, gemini
handler.command = new RegExp; // Patrón clave (igual que en tu código)
handler.tags = ['ai'];
handler.help = ['bot <texto>', 'gemini <texto>'];

export default handler;
