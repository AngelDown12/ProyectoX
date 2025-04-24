import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, conn }) => {
  if (!text) throw `*📌 Ejemplo de uso:*\n\n- Con punto: ${usedPrefix}bard dime un chiste\n- Sin punto: bard escribe un poema`;
  
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

// Configuración para que funcione CON y SIN punto
handler.customPrefix = /^(\.)?(bard|gemini)/i; // Detecta ".bard", "bard", ".gemini", "gemini"
handler.command = /^(bard|gemini)$/i; // Opcional: para asegurar que solo esos comandos se activen
handler.tags = ['ai'];
handler.help = ['bard <texto>', 'gemini <texto>'];

export default handler;
