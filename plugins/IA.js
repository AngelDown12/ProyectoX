import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  // Elimina "bard" o "gemini" del mensaje (incluyendo si lleva punto)
  const query = m.text.replace(/^[\.]?(bard|gemini)\s*/i, '').trim();
  
  if (!query) throw `*📌 Ejemplos de uso:*\n\n- Con punto: .bard dime un chiste\n- Sin punto: gemini escribe un poema`;

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
handler.customPrefix = /^(\.)?(bard|gemini)/i; // Detecta .bard, bard, .gemini, gemini
handler.command = new RegExp; // Patrón clave (igual que en tu código)
handler.tags = ['ai'];
handler.help = ['bard <texto>', 'gemini <texto>'];

export default handler;
