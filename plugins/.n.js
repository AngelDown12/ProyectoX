import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;

    const msg = generateWAMessageFromContent(m.chat, {
      [quoted.mtype]: quoted.message[quoted.mtype]
    }, {
      quoted: m,
      userJid: conn.user.id
    });

    await conn.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id,
      contextInfo: { mentionedJid: users }
    });

  } catch {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);

    if (isMedia) {
      const mediax = await quoted.download?.();
      const options = { mentions: users, quoted: m };

      if (quoted.mtype === 'imageMessage') {
        conn.sendMessage(m.chat, { image: mediax, caption: text || '', ...options });
      } else if (quoted.mtype === 'videoMessage') {
        conn.sendMessage(m.chat, { video: mediax, caption: text || '', mimetype: 'video/mp4', ...options });
      } else if (quoted.mtype === 'audioMessage') {
        conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mpeg', fileName: 'notify.mp3', ...options });
      } else if (quoted.mtype === 'stickerMessage') {
        conn.sendMessage(m.chat, { sticker: mediax, ...options });
      }
    } else {
      await conn.sendMessage(m.chat, {
        text: text || '',
        mentions: users
      }, { quoted: m });
    }
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
