import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";
import { writeFileSync, unlinkSync } from "fs";
import { execSync } from "child_process";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `*[❗] Por favor, responde a un archivo válido (audio, imagen, etc.).*`, m);
  
  await conn.sendMessage(m.chat, { react: { text: "🎧", key: m.key } });

  try {
    let media = await q.download();
    let inputPath = `./tmp_${crypto.randomBytes(5).toString("hex")}.input`;
    let outputPath = `./tmp_${crypto.randomBytes(5).toString("hex")}.ogg`;

    // Guarda el archivo temporalmente
    writeFileSync(inputPath, Buffer.from(media));

    // Convierte a OGG con ffmpeg
    execSync(`ffmpeg -i ${inputPath} -c:a libopus -b:a 48k -vn ${outputPath}`);

    // Lee archivo convertido
    const converted = require("fs").readFileSync(outputPath);
    const link = await catbox(converted);

    // Limpieza
    unlinkSync(inputPath);
    unlinkSync(outputPath);

    let txt = `*乂 C A T B O X - U P L O A D E R 乂*\n\n`;
    txt += `*» Enlace* : ${link}\n`;
    txt += `*» Tamaño* : ${formatBytes(converted.length)}\n`;
    txt += `*» Formato forzado* : .ogg\n\n`;
    txt += `> *${wm}*`;

    await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: "Elite Bot - Catbox OGG Uploader",
          body: "¡Subida exitosa en formato .ogg!",
          thumbnailUrl: gataMenu,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: accountsgb
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `*[❌] Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`
    });
  }
};

handler.help = ['ogg'];
handler.tags = ['herramientas'];
handler.command = ['ogg'];

export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const blob = new Blob([content], { type: 'audio/ogg' });
  const formData = new FormData();
  const randomName = crypto.randomBytes(5).toString("hex") + ".ogg";
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomName);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}
