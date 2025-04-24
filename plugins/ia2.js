import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text) throw `*📌 Ejemplo:*\n.ia imagen de un lobo en el bosque`;
  
  try {
    await m.reply('🔄 Generando imagen...');
    
    // API de Stable Diffusion (ejemplo)
    const apiUrl = 'https://stablediffusionapi.com/api/v3/text2img';
    const apiKey = 'TU_API_KEY'; // Reemplaza con tu API key
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: apiKey,
        prompt: text,
        width: '512',
        height: '512',
      }),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      await conn.sendFile(m.chat, data.output[0], 'ia.jpg', `✅ *Imagen generada:*\n"${text}"`, m);
    } else {
      throw '❌ Error al generar la imagen. Intenta con otra descripción.';
    }
  } catch (e) {
    console.error(e);
    await m.reply('🔴 *Error:* La API no respondió. Prueba más tarde o cambia de servicio.');
  }
};

handler.help = ['ia <texto>', 'imagenia <texto>'];
handler.tags = ['ai'];
handler.command = /^(ia|imagenia)$/i;
export default handler;
