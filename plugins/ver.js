import fetch from 'node-fetch';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata }) {
  const FOTO_DEF = 'https://qu.ax/Lmiiu.jpg';
  if (!m.isGroup || !m.messageStubType) return;

  const chat = global.db.data.chats[m.chat] || {};
  const userId = m.messageStubParameters?.[0];
  if (!userId) return;

  let userTag = `@${userId.split('@')[0]}`;
  let groupName = groupMetadata.subject;
  let desc = groupMetadata.desc || '¡Nuevo integrante!';

  // Imagen personalizada o por defecto
  let img = chat.customWelcome?.enabled ? chat.customWelcome.image : await conn.profilePictureUrl(userId, 'image').catch(_ => FOTO_DEF);

  // Mensaje personalizado o por defecto
  let messageText = '';
  let useCustom = chat.customWelcome?.enabled;

  if (m.messageStubType === 27) { // WELCOME
    messageText = useCustom
      ? chat.customWelcome.message.replace(/@user/g, userTag).replace(/@group/g, groupName).replace(/@desc/g, desc)
      : `👋 ¡Bienvenido ${userTag} a *${groupName}*!`;

  } else if (m.messageStubType === 28) { // GOODBYE
    messageText = useCustom
      ? '👋' // No hay mensaje de despedida personalizado, puedes expandirlo si quieres.
      : `👋 ${userTag} salió del grupo.`;

  } else return;

  await conn.sendMessage(m.chat, {
    text: messageText,
    contextInfo: {
      mentionedJid: [userId],
      externalAdReply: {
        title: groupName,
        thumbnailUrl: img,
        sourceUrl: 'https://whatsapp.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });
};

export default handler;
