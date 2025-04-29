handler.before = async (m, { conn, usedPrefix }) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat.simi || !m.text) return true;

  const text = m.text.trim();
  const isCommand = text.startsWith(usedPrefix);

  // Verifica si el texto coincide con comandos registrados
  if (isCommand) {
    const command = text.slice(usedPrefix.length).split(/\s+/)[0].toLowerCase();
    const allCommands = Object.values(global.plugins).flatMap(p => Array.isArray(p.command) ? p.command : [p.command]);
    const isKnownCommand = allCommands.some(cmd =>
      typeof cmd === 'string' ? cmd === command : cmd instanceof RegExp ? cmd.test(command) : false
    );
    if (isKnownCommand) return; // ❌ NO responde a comandos conocidos
  }

  // Filtro de palabras excluidas
  const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
  if (excludedWords.some(w => text.toLowerCase().includes(w))) return;

  try {
    const username = conn.getName(m.sender);
    const basePrompt = `Tu nombre es BarbozaBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;
    const prompt = `${basePrompt}. Responde lo siguiente: ${text}`;
    const response = await callBarbozaAPI(text, username, prompt);
    await conn.reply(m.chat, response, m);
  } catch (e) {
    console.error('❌ Error al responder:', e);
    await conn.reply(m.chat, '❌ Error al procesar tu mensaje.', m);
  }

  return !0;
};
