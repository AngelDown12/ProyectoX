import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);

    // Si es un mensaje de media
    if (isMedia) {
      const mediax = await quoted.download?.();
      const options = { mentions: users, quoted: m };

      if (quoted.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: mediax, caption: text || '', ...options });
      } else if (quoted.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: mediax, caption: text || '', mimetype: 'video/mp4', ...options });
      } else if (quoted.mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mpeg', ptt: true, ...options });
      } else if (quoted.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { sticker: mediax, ...options });
      }
    } else {
      // Mensaje de texto normal
      await conn.sendMessage(m.chat, {
        text: text || quoted.text || '',
        mentions: users
      }, { quoted: m });
    }

  } catch (e) {
    console.error('Error en el comando hidetag:', e);
    await conn.sendMessage(m.chat, {
      text: text || '',
      mentions: participants.map(u => conn.decodeJid(u.id))
    }, { quoted: m });
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
