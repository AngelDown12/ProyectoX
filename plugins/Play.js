import fetch from "node-fetch";
import yts from "yt-search";

// APIs funcionales del segundo código
const APIs = {
  dorratz: "https://api.dorratz.com/v3/ytdl",
  neoxr: {
    url: "https://api.neoxr.eu.org/api",
    key: "tu-api-key-neoxr" // Reemplaza con tu API key si es necesario
  },
  fgmods: "https://api.fgmods.xyz/api/downloader/ytmp4",
  siputzx: "https://api.siputzx.my.id/api/d/ytmp4",
  zenkey: "https://api.zenkey.my.id/api/download/ytmp3",
  exonity: "https://exonity.tech/api/dl/playmp3"
};

const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Manejo para diferentes formatos de respuesta de APIs
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      } else if (data?.medias?.find(media => media.extension === "mp3")) {
        return { download: { url: data.medias.find(media => media.extension === "mp3").url } };
      } else if (data?.result?.download?.url) {
        return data.result;
      } else if (data?.data?.url) {
        return { download: { url: data.data.url } };
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 �𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯.\n\n» �𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} Cypher - Rich Vagos`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // 1. Enviar primero el mensaje con info del video (manteniendo diseño original)
    await conn.sendMessage(m.chat, {
      text: `01:27 ━━━━━⬤────── 05:48\n*⇄ㅤ      ◁        ❚❚        ▷        ↻*\n╴𝗘𝗹𝗶𝘁𝗲 𝗕𝗼𝘁 𝗚𝗹𝗼𝗯𝗮𝗹`,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: "",
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: video.url
        }
      }
    }, { quoted: m });

    // 2. Intentar descargar audio con múltiples APIs (del segundo código)
    let apiData;
    const apisToTry = [
      `${APIs.dorratz}?url=${encodeURIComponent(video.url)}`,
      `${APIs.neoxr.url}/youtube?url=${encodeURIComponent(video.url)}&type=audio&quality=128kbps&apikey=${APIs.neoxr.key}`,
      `${APIs.fgmods}?url=${encodeURIComponent(video.url)}&apikey=${APIs.fgmods.key}`,
      `${APIs.siputzx}?url=${encodeURIComponent(video.url)}`,
      `${APIs.zenkey}?apikey=zenkey&url=${encodeURIComponent(video.url)}`,
      `${APIs.exonity}?query=${encodeURIComponent(video.title)}`
    ];

    for (const apiUrl of apisToTry) {
      try {
        apiData = await fetchWithRetries(apiUrl);
        if (apiData?.download?.url) break;
      } catch (e) {
        console.log(`Error con API ${apiUrl}:`, e.message);
      }
    }

    if (!apiData?.download?.url) throw new Error("Todas las APIs fallaron");

    // 3. Enviar audio (manteniendo formato original)
    await conn.sendMessage(m.chat, {
      audio: { url: apiData.download.url },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, { 
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}` 
    }, { quoted: m });
  }
};

handler.command = ['playy'];
handler.exp = 0;
export default handler;
