handler.before = async (m, { conn, usedPrefix }) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat.simi) return true;

  const text = m.text || '';
  const isCommand = text.startsWith(usedPrefix);

  // ⛔ Bloquear si coincide con algún comando registrado
  if (isCommand) {
    const command = text.slice(usedPrefix.length).trim().split(/ +/).shift().toLowerCase();
    const allCommands = Object.values(global.plugins).flatMap(p => p?.command instanceof Array ? p.command : [p.command]);
    if (allCommands.some(cmd => typeof cmd === 'string' ? cmd === command : cmd instanceof RegExp ? cmd.test(command) : false)) return;
  }

  // Palabras prohibidas específicas
  const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
  if (excludedWords.some(word => text.toLowerCase().includes(word))) return;

  try {
    const username = conn.getName(m.sender);
    const basePrompt = `Tu nombre es BarbozaBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;
    const prompt = `${basePrompt}. Responde lo siguiente: ${text}`;
    const response = await callBarbozaAPI(text, username, prompt);
    await conn.reply(m.chat, response, m);
  } catch (e) {
    console.error('❌ Error en SIMI:', e);
    await conn.reply(m.chat, '❌ Error al procesar tu mensaje.', m);
  }

  return !0;
};
