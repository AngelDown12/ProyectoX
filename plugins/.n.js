import MessageType from '@whiskeysockets/baileys';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id));
  let q = m.quoted ? m.quoted : m;
  let c = m.quoted ? m.quoted : m.msg;

  // Detectar si es multimedia
  const mime = (q.msg || q).mimetype || '';
  const isMedia = /image|video|audio|sticker/.test(mime);

  if (isMedia) {
    const media = await q.download?.();
    const options = { mentions: users, quoted: m };

    switch (q.mtype) {
      case 'imageMessage':
        return conn.sendMessage(m.chat, { image: media, caption: text || '', ...options });
      case 'videoMessage':
        return conn.sendMessage(m.chat, { video: media, caption: text || '', mimetype: 'video/mp4', ...options });
      case 'audioMessage':
        return conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', ptt: true, ...options });
      case 'stickerMessage':
        return conn.sendMessage(m.chat, { sticker: media, ...options });
    }
  }

  const msg = conn.cMod(m.chat,
    generateWAMessageFromContent(m.chat, {
      [c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON ? c.toJSON() : {
        text: c || ''
      }
    }, {
      quoted: m,
      userJid: conn.user.id
    }),
    text || q.text, conn.user.jid, { mentions: users }
  );

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = ['hidetag', 'notify', 'nn', 'noti'];
handler.group = true;
handler.admin = true;

export default handler;
