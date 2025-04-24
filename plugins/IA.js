import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text) throw `*📌 Ejemplo de uso:*\n\nbard dime un chiste\ngemini cómo hacer un código en Python`;
  
  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    await m.reply(data.result || '🔴 Error en la respuesta de la API');
  } catch (error) {
    console.error('Error en Gemini/Bard:', error);
    await m.reply('❌ Ocurrió un error al procesar tu consulta');
  }
};

// Configuración clave (igual que tu comando "estado")
handler.customPrefix = /^(bard|gemini)/i;  // Se activa con "bard" o "gemini" sin prefijo
handler.command = new RegExp;  // Patrón de tu comando existente
handler.tags = ['ai'];
handler.help = ['bard <texto>', 'gemini <texto>'];

export default handler;
