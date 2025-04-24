import fetch from 'node-fetch';

let handler = async (m, { text, mentionedJid, conn }) => {
  // Detectar si el bot fue etiquetado o si se usó el comando bard/gemini
  const isTagged = mentionedJid.includes(conn.user.jid);
  const isCommand = /^[\.]?(bard|gemini)/i.test(m.text);
  
  if (!isTagged && !isCommand) return; // Si no es para el bot, ignora

  // Extraer la consulta (elimina menciones/comandos)
  let query = m.text.replace(/^@\d+\s+/i, '') // Elimina @EliteBot
                    .replace(/^[\.]?(bard|gemini)\s*/i, '') // Elimina comandos
                    .trim();

  if (!query) throw `*📌 Etiquétame o usa:*\n\n- @EliteBot dime un chiste\n- .bard explica la teoría cuántica`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    await m.reply(data.result || '🔴 No obtuve respuesta');
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al procesar tu solicitud');
  }
};

// Configuración para etiquetas (@) y comandos
handler.customPrefix = /^(\.?bard|\.?gemini|@\d+)/i; // Detecta @EliteBot, .bard, bard, etc.
handler.command = new RegExp;
handler.tags = ['ai'];
handler.help = ['@EliteBot <consulta>', 'bard <texto>'];

export default handler;
