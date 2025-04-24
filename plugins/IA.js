import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  // Eliminamos el prefijo si existe (para manejar ambos casos)
  const cleanText = text.replace(/^[\.\/\!]/, '').trim();
  
  if (!cleanText) throw `*📌 Ejemplos de uso:*\n\n- Con punto: .bard dime un chiste\n- Sin punto: bard escribe un poema`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(cleanText)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    await m.reply(data.result || '🔴 La API no respondió');
  } catch (error) {
    console.error('Error:', error);
    await m.reply('❌ Error al procesar tu solicitud');
  }
};

// Configuración universal
handler.command = /^(\.?bard|\.?gemini)$/i; // Detecta .bard, bard, .gemini, gemini
handler.tags = ['ai'];
handler.help = ['bard <texto>', 'gemini <texto>'];

export default handler;
