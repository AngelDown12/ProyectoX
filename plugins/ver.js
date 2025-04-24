import fetch from 'node-fetch';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return;

  const FOTO_PREDETERMINADA = 'https://qu.ax/Lmiiu.jpg';
  let chat = global.db.data.chats[m.chat];
  if (!chat) chat = global.db.data.chats[m.chat] = {};

  let idUser = m.messageStubParameters[0];
  let username = idUser.split('@')[0];
  let subject = groupMetadata.subject;
  let descs = groupMetadata.desc || '🌟 ¡Bienvenido al grupo! 🌟';

  let pp;
  try {
    pp = await conn.profilePictureUrl(idUser, 'image');
  } catch {
    pp = chat.welcomeImage || FOTO_PREDETERMINADA;
  }

  const isJoin = m.messageStubType === 27;
  const isLeave = m.messageStubType === 28;

  let mensaje = isJoin ? chat.sWelcome : chat.sBye;
  let textoDefecto = isJoin
    ? `👋 Bienvenido @${username} a *${subject}*\n\n${descs}`
    : `👋 Adiós @${username}, se fue del grupo.`;

  let mensajeFinal = (chat.customWelcome && mensaje) 
    ? mensaje.replace(/@user/g, `@${username}`).replace(/@group/g, subject).replace(/@desc/g, descs)
    : textoDefecto;

  if ((isJoin || isLeave) && conn.user.jid !== idUser) {
    await conn.sendMessage(m.chat, {
      text: mensajeFinal,
      contextInfo: {
        mentionedJid: [idUser],
        externalAdReply: {
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋',
          body: '',
          thumbnailUrl: pp,
          sourceUrl: 'https://whatsapp.com',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: m });
  }
};

export default handler;
