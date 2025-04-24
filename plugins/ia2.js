import fetch from 'node-fetch';
import gtts from 'node-gtts';
import {readFileSync, unlinkSync} from 'fs';
import {join} from 'path';
import axios from 'axios';
import translate from '@vitalets/google-translate-api';
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
  organization: global.openai_org_id,
  apiKey: global.openai_key
});
const openaiii = new OpenAIApi(configuration);
const idioma = 'es';
const sistema1 = `Actuaras como un Bot de WhatsApp el cual fue creado por GataNina-Li, tu seras GataBot-MD`;

const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!text) throw `*[❗] Ingrese una orden o petición para usar la función de voz IA*\n\nEjemplo:\n${usedPrefix + command} Recomiéndame una serie`;

  try {
    conn.sendPresenceUpdate('recording', m.chat);

    async function getOpenAIChatCompletion(texto) {
      const openaiAPIKey = global.openai_key;

      // Aseguramos que exista el historial del usuario
      if (!global.chatgpt.data.users[m.sender]) global.chatgpt.data.users[m.sender] = [];
      let chgptdb = global.chatgpt.data.users[m.sender];

      chgptdb.push({ role: 'user', content: texto });

      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiAPIKey}`
      };

      const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: sistema1 }, ...chgptdb],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();
      const finalResponse = result.choices[0].message.content;
      return finalResponse;
    }

    let respuesta = await getOpenAIChatCompletion(text);
    if (!respuesta || respuesta === 'error') throw 'Sin respuesta';

    const audio1 = await tts(respuesta, idioma);
    await conn.sendMessage(m.chat, {
      audio: audio1,
      fileName: 'ia.mp3',
      mimetype: 'audio/mpeg',
      ptt: true
    }, {quoted: m});

  } catch (e) {
    console.log('[❌ ERROR] ', e);
    throw '*❌ Ocurrió un error al generar o enviar el audio.*';
  }
};

handler.command = /^(openaivoz|chatgptvoz|iavoz|aivoice|robotvoz|openai2voz|chatgpt2voz|ia2voz|robot2voz)$/i;
export default handler;

// Función para convertir texto a audio
async function tts(text = 'error', lang = 'es') {
  return new Promise((resolve, reject) => {
    try {
      const tts = gtts(lang);
      const filePath = join(global.__dirname(import.meta.url), '../tmp', `${Date.now()}.wav`);
      tts.save(filePath, text, () => {
        const audio = readFileSync(filePath);
        unlinkSync(filePath);
        resolve(audio);
      });
    } catch (e) {
      reject(e);
    }
  });
}
