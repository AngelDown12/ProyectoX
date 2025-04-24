import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  // Extrae el texto después de "bard" o "gemini" (ignora prefijos)
  const query = m.text.match(/(?:^[\.]?)(bard|gemini)\s+(.*)/i)?.[2]?.trim();
  
  if (!query) throw `*📌 Ejemplos de uso:*\n\n- Con punto: .bard dime un chiste\n- Sin punto: bard escribe un poema`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    await m.reply(data.result || '🔴 La API no respondió');
  } catch (error) {
    console.error('Error:', error);
    await m.reply('❌ Error al procesar tu solicitud');
  }
};

// Configuración universal
handler.command = /^(\.?bard|\.?gemini|bard|gemini)$/i; // Captura todas las variantes
handler.tags = ['ai'];
handler.help = ['bard <texto>', 'gemini <texto>'];

export default handler;
