import fetch from 'node-fetch';
import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

let handler = async (m, { text, conn }) => {
  // Verificar si el mensaje usa el comando .iavoz
  const isCommand = /^[\.]?(iavoz)/i.test(m.text);
  
  if (!isCommand) return;

  // Extraer la consulta (elimina el comando .iavoz)
  let query = m.text
    .replace(/^[\.]?(iavoz)\s*/i, '') // Elimina el comando .iavoz
    .trim();

  if (!query) throw `¡Hola!\nMi nombre es Elite Bot\n¿En qué te puedo ayudar? ♥️`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    
    // Usando la API de starlights-team
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.result) {
      // Generar el audio de la respuesta
      const audio = await tts(data.result, 'es');
      
      // Enviar el audio generado
      await conn.sendMessage(m.chat, {
        audio: audio,
        fileName: 'respuesta.mp3',
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m });
    } else {
      await m.reply('🔴 Error en la API');
    }
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al procesar');
  }
};

// Configuración universal
handler.customPrefix = /^(\.?iavoz)$/i;
handler.command = new RegExp;
handler.tags = ['ai'];
export default handler;

async function tts(text = 'error', lang = 'es') {
  return new Promise((resolve, reject) => {
    try {
      const tts = gtts(lang);
      const filePath = join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.mp3');  // Usamos mp3
      tts.save(filePath, text, () => {
        const audioBuffer = readFileSync(filePath);
        unlinkSync(filePath); // Eliminamos el archivo después de leerlo
        resolve(audioBuffer); // Devolvemos el buffer de audio
      });
    } catch (e) {
      reject(e);
    }
  });
}
