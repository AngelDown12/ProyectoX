import { writeFileSync, unlinkSync, readFileSync } from "fs";
import { execSync } from "child_process";
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime.includes("audio")) {
    return conn.reply(m.chat, `*[❗] Responde a un audio válido para convertir a .ogg*`, m);
  }

  await conn.sendMessage(m.chat, { react: { text: "🎧", key: m.key } });

  try {
    let media = await q.download();
    let input = `./input_${Date.now()}.tmp`;
    let output = `./output_${Date.now()}.ogg`;

    writeFileSync(input, Buffer.from(media));

    // Conversión real a .ogg
    execSync(`ffmpeg -i ${input} -c:a libopus -b:a 48k ${output}`);

    let buffer = readFileSync(output);
    let url = await uploadToCatbox(buffer);

    // Limpieza
    unlinkSync(input);
    unlinkSync(output);

    let mensaje = `*乂 C A T B O X - O G G 乂*\n\n`;
    mensaje += `*» Enlace:* ${url}\n`;
    mensaje += `*» Formato:* .ogg\n`;
    mensaje += `*» Tamaño:* ${(buffer.length / 1024).toFixed(2)} KB`;

    await conn.sendMessage(m.chat, {
      text: mensaje,
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.reply(m.chat, `*[❌] Hubo un error al convertir o subir el audio.*`, m);
  }
};

handler.help = ['ogg'];
handler.tags = ['herramientas'];
handler.command = ['ogg'];

export default handler;

// Función que sube a Catbox
async function uploadToCatbox(contentBuffer) {
  const blob = new Blob([contentBuffer], { type: 'audio/ogg' });
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", blob, `audio_${Date.now()}.ogg`);

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
  });

  const url = await res.text();
  return url;
}
