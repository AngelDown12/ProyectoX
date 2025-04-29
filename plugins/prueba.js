handler.before = async (m, { conn, usedPrefix }) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat.simi || !m.text) return true; // No hace nada si no hay texto

  const text = m.text.trim();

  // Si el mensaje empieza con el prefijo de un comando, no hace nada
  if (text.startsWith(usedPrefix)) return;

  // Filtro de palabras excluidas
  const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
  if (excludedWords.some(w => text.toLowerCase().includes(w))) return;

  try {
    const username = conn.getName(m.sender);
    const basePrompt = `Tu nombre es BarbozaBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;
    const prompt = `${basePrompt}. Responde lo siguiente: ${text}`;
    
    // Llamada a la API Luminai
    const response = await callBarbozaAPI(text, username, prompt);
    await conn.reply(m.chat, response, m);
  } catch (e) {
    console.error('❌ Error al responder:', e);
    await conn.reply(m.chat, '❌ Error al procesar tu mensaje.', m);
  }

  return !0; // Permite la respuesta sin ejecutar otros handlers
};
