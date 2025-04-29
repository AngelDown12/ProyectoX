import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = (m) => m;

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat];
  if (chat.simi) {
    if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;
    
    let textodem = m.text;
    
    // Filtro de palabras excluidas (mejorado)
    const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 
                         'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 
                         'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
    
    if (excludedWords.some(word => textodem.toLowerCase().includes(word))) return;
    
    try {
      // Primero intentamos con SIMI
      const ressimi = await simitalk(textodem);
      
      // Si SIMI falla o devuelve vacío, probamos con Gemini
      if (!ressimi.status || !ressimi.resultado?.simsimi) {
        const geminiResponse = await callGeminiAPI(textodem);
        await conn.reply(m.chat, geminiResponse, m);
      } else {
        await conn.reply(m.chat, ressimi.resultado.simsimi, m);
      }
    } catch (error) {
      console.error('Error en handler SIMI/Gemini:', error);
      await conn.reply(m.chat, '❌ Ocurrió un error al procesar tu mensaje', m);
    }
    return !0;
  }
  return true;
};

export default handler;

// Función SIMI original mejorada
async function simitalk(ask, apikeyyy = "i6FxuA9vxlvz5cKQCt3", language = "es") {
    if (!ask) return { status: false, resultado: { msg: "Ingresa un texto para hablar con SIMI" }};
    
    try {
        const response1 = await axios.get(`https://deliriussapi-oficial.vercel.app/tools/simi?text=${encodeURIComponent(ask)}`);
        
        if (!response1.data?.data?.message) throw new Error('Respuesta vacía de API SIMI 1');
        
        const trad1 = await translate(response1.data.data.message, {to: language, autoCorrect: true});
        
        if (!trad1.text || trad1.text.toLowerCase() === 'indefinida') {
            throw new Error('Traducción inválida');
        }
        
        return { status: true, resultado: { simsimi: trad1.text }};        
    } catch (error1) {
        console.error('Error con SIMI API 1:', error1);
        
        try {
            const response2 = await axios.get(`https://anbusec.xyz/api/v1/simitalk?apikey=${apikeyyy}&ask=${ask}&lc=${language}`);
            
            if (!response2.data?.message) throw new Error('Respuesta vacía de API SIMI 2');
            
            return { status: true, resultado: { simsimi: response2.data.message }};       
        } catch (error2) {
            console.error('Error con SIMI API 2:', error2);
            return { status: false };
        }
    }
}

// Nueva función para llamar a la API Gemini
async function callGeminiAPI(query) {
    try {
        const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(query)}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) throw new Error(`API Gemini responded with status ${res.status}`);
        
        const data = await res.json();
        
        if (!data?.result) throw new Error('Empty response from Gemini API');
        
        return data.result.trim();
    } catch (error) {
        console.error('Error con API Gemini:', error);
        return 'Lo siento, no pude procesar tu solicitud. Intenta nuevamente más tarde.';
    }
}
