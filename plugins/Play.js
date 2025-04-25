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

    // Enviar info del video (mismo diseño)
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

    // API rápida con calidad baja (128kbps para mayor velocidad)
    const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}&quality=128`;
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();

    if (!apiData?.result?.download?.url) {
      // Si falla, intentamos con calidad aún más baja (64kbps)
      const fallbackUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}&quality=64`;
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();
      if (!fallbackData?.result?.download?.url) throw new Error("No se pudo obtener el audio");
      
      // Enviar audio de baja calidad (más rápido)
      await conn.sendMessage(m.chat, {
        audio: { url: fallbackData.result.download.url },
        mimetype: "audio/mpeg",
        fileName: `${video.title}_rapido.mp3`,
        ptt: true // Opción que a veces acelera el envío
      }, { quoted: m });
    } else {
      // Enviar audio con calidad media
      await conn.sendMessage(m.chat, {
        audio: { url: apiData.result.download.url },
        mimetype: "audio/mpeg",
        fileName: `${video.title}.mp3`
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, { 
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}\n\n⚠️ Intenta con un nombre más específico.` 
    }, { quoted: m });
  }
};

handler.command = ['playy'];
handler.exp = 0;
export default handler;
