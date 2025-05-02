import fetch from "node-fetch";
import crypto from "crypto";
import { FormData } from "formdata-node";
import { fileFromBuffer } from "formdata-node/file-from-buffer";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `*[❗] Responde a un archivo válido (nota de voz, audio, etc.).*`, m);

  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    let media = await q.download();
    let link = await catbox(media);

    let txt = `*乂 C A T B O X - .O G G - U P L O A D E R 乂*\n\n`;
    txt += `*» Enlace* : ${link}\n`;
    txt += `*» Tamaño* : ${formatBytes(media.length)}\n`;
    txt += `*» Formato* : .ogg\n\n`;
    txt += `> *${wm}*`;

    await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: "Elite Bot - Catbox OGG Uploader",
          body: "¡Subida exitosa como .ogg!",
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
handler.command = ['ogg', 'catogg'];

export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const file = await fileFromBuffer(content, 'audio.ogg', 'audio/ogg');
  const formData = new FormData();
  formData.set('reqtype', 'fileupload');
  formData.set('fileToUpload', file);

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  return await res.text();
}
