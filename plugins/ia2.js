import fetch from 'node-fetch';
import gtts from 'node-gtts';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import translate from '@vitalets/google-translate-api';
import { Configuration, OpenAIApi } from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configuration = new Configuration({ organization: global.openai_org_id, apiKey: global.openai_key });
const openaiii = new OpenAIApi(configuration);
const idioma = 'es';
const sistema1 = `Actuaras como un Bot de WhatsApp el cual fue creado por GataNina-Li, tu seras GataBot-MD`;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!text) throw `*[❗] Ingrese una petición para usar esta función de voz de IA.*`;

  try {
    conn.sendPresenceUpdate('recording', m.chat);

    async function getOpenAIChatCompletion(texto) {
      let chgptdb = global.chatgpt.data.users[m.sender];
      chgptdb.push({ role: 'user', content: texto });
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${global.openai_key}` };
      const data = { model: "gpt-3.5-turbo", messages: [{ role: "system", content: sistema1 }, ...chgptdb] };
      const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) });
      const result = await response.json();
      return result.choices?.[0]?.message?.content || null;
    }

    let respuesta = await getOpenAIChatCompletion(text);
    if (!respuesta) throw '❌ No se recibió respuesta válida';

    const audio = await tts(respuesta, idioma);
    if (!audio) throw '❌ No se pudo generar el audio';

    await conn.sendMessage(m.chat, {
      audio: audio,
      fileName: 'respuesta.mp4',
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });

  } catch (e) {
    console.log('[❌ ERROR]', e);
    throw '*❌ Ocurrió un error al generar o enviar el audio.*';
  }
};

handler.command = /^(openaivoz|chatgptvoz|iavoz|aivoice|robotvoz|openai2voz|chatgpt2voz|ia2voz|robot2voz)$/i;
export default handler;

// ✅ Función tts() robusta con gtts
async function tts(text = 'error', lang = 'es') {
  return new Promise((resolve, reject) => {
    try {
      const tts = gtts(lang);
      const filename = Date.now() + '.wav';
      const tmpPath = join(__dirname, '../tmp');
      const filePath = join(tmpPath, filename);

      if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath, { recursive: true });

      tts.save(filePath, text, () => {
        try {
          const buffer = fs.readFileSync(filePath);
          fs.unlinkSync(filePath);
          resolve(buffer);
        } catch (err) {
          reject('❌ No se pudo leer el archivo generado: ' + err);
        }
      });
    } catch (e) {
      reject('❌ Error en TTS: ' + e);
    }
  });
}
