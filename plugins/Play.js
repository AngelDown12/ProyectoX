import fetch from "node-fetch";
import yts from "yt-search";

// Lista de APIs de respaldo (actualizadas)
const BACKUP_APIS = [
  {
    name: "zenkey",
    url: (videoUrl) => `https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${encodeURIComponent(videoUrl)}`,
    extract: (data) => data?.result?.download?.url
  },
  {
    name: "savetube",
    url: (videoUrl) => `https://api.savetube.me/download?url=${encodeURIComponent(videoUrl)}`,
    extract: (data) => data?.url
  },
  {
    name: "yt1s",
    url: (videoUrl) => `https://yt1s.io/api/ajaxSearch?q=${encodeURIComponent(videoUrl)}`,
    extract: (data) => data?.links?.mp3?.auto?.k ? `https://yt1s.io/api/ajaxConvert?vid=${data.vid}&k=${data.links.mp3.auto.k}` : null
  },
  {
    name: "y2mate",
    url: (videoUrl) => `https://www.y2mate.com/mates/analyzeV2/ajax`,
    extract: async (data, videoUrl) => {
      const k = data?.links?.mp3?.mp3128?.k;
      if (!k) return null;
      const convertUrl = `https://www.y2mate.com/mates/convertV2/index`;
      const convertRes = await fetch(convertUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `vid=${encodeURIComponent(videoUrl)}&k=${k}`
      });
      const convertData = await convertRes.json();
      return convertData?.dlink;
    }
  },
  {
    name: "onlinevideoconverter",
    url: (videoUrl) => `https://onlinevideoconverter.pro/api/convert`,
    extract: (data) => data?.url
  }
];

const fetchWithRetries = async (url, options = {}, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

const getAudioUrl = async (videoUrl, videoTitle) => {
  for (const api of BACKUP_APIS) {
    try {
      console.log(`Probando API: ${api.name}`);
      const apiUrl = api.url(videoUrl);
      const data = await fetchWithRetries(apiUrl, {
        method: api.method || "GET",
        headers: api.headers || {},
        body: api.body
      });
      
      const audioUrl = await api.extract(data, videoUrl);
      if (audioUrl) {
        console.log(`Éxito con API: ${api.name}`);
        return audioUrl;
      }
    } catch (error) {
      console.error(`Error con API ${api.name}:`, error.message);
    }
  }
  throw new Error("Todas las APIs fallaron");
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} Cypher - Rich Vagos`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Enviar información del video (manteniendo diseño original)
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

    // Obtener URL del audio
    const audioUrl = await getAudioUrl(video.url, video.title);

    // Enviar audio
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`.replace(/[<>:"/\\|?*]+/g, '')
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, { 
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}\n\n⚠️ Intenta con otro nombre de canción o prueba más tarde.` 
    }, { quoted: m });
  }
};

handler.command = ['playy'];
handler.exp = 0;
export default handler;
