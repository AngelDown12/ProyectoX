import fetch from "node-fetch";
import yts from "yt-search";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} Cypher - Rich Vagos`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // 1. Enviar primero el mensaje con info del video (diseño original)
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

    // 2. Usar la API funcional de vreden.my.id
    const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`API respondió con estado ${response.status}`);
    
    const apiData = await response.json();
    
    if (!apiData?.result?.download?.url) {
      throw new Error("No se pudo obtener el enlace de descarga");
    }

    // 3. Enviar audio (manteniendo formato original)
    await conn.sendMessage(m.chat, {
      audio: { url: apiData.result.download.url },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    
    // Mensaje de error mejorado
    let errorMessage = `❌ *Error al procesar tu solicitud:*\n`;
    if (error.message.includes("API respondió")) {
      errorMessage += "El servidor de música no respondió correctamente";
    } else if (error.message.includes("enlace de descarga")) {
      errorMessage += "No se pudo generar el enlace de descarga";
    } else {
      errorMessage += error.message || "Error desconocido";
    }
    
    errorMessage += "\n\n🔸 *Solución:*\n• Intenta con otro nombre de canción\n• Verifica tu conexión a internet\n• Prueba más tarde";
    
    await conn.sendMessage(m.chat, { text: errorMessage }, { quoted: m });
  }
};

handler.command = ['playy'];
handler.exp = 0;
export default handler;
