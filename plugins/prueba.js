handler.before = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];
  if (chat.simi) {
    if (m.text?.startsWith(global.prefix)) return; // ⛔ Ignora comandos
    if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;

    let textodem = m.text;

    const excludedWords = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'sc', 'sticker', 's', 'textbot', 'qc'];
    const words = textodem.toLowerCase().split(/\s+/);
    if (excludedWords.some(word => words.includes(word))) return;

    try {
      const username = `${conn.getName(m.sender)}`;
      const basePrompt = `Tu nombre es BarbozaBot y parece haber sido creado por BotBarboza-Ai. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;

      const prompt = `${basePrompt}. Responde lo siguiente: ${textodem}`;

      const response = await callBarbozaAPI(textodem, username, prompt);

      await conn.reply(m.chat, response, m);
    } catch (error) {
      console.error('Error en handler Luminai:', error);
      await conn.reply(m.chat, '❌ Ocurrió un error al procesar tu mensaje', m);
    }
    return !0;
  }
  return true;
};
