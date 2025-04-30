import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';

    const q = m.quoted || m;
    const c = m.quoted ? await m.getQuotedObj() : m;

    if (m.quoted) {
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [q.mtype]: c.message[q.mtype] },
          { quoted: m, userJid: conn.user.id }
        ),
        (text || '') + watermark,
        conn.user.jid,
        { mentions: users }
      );
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } else {
      await conn.sendMessage(m.chat, {
        text: (text || '') + watermark,
        mentions: users
      }, { quoted: m });
    }

  } catch {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const watermark = '\n©𝖤𝗅𝗂𝗍𝖾𝖡𝗈𝗍𝖦𝗅𝗈𝖻𝖺𝗅';

    if (isMedia) {
      const mediax = await quoted.download?.();
      const options = { mentions: users, quoted: m };

      if (quoted.mtype === 'imageMessage') {
        conn.sendMessage(m.chat, { image: mediax, caption: (text || '') + watermark, ...options });
      } else if (quoted.mtype === 'videoMessage') {
        conn.sendMessage(m.chat, { video: mediax, caption: (text || '') + watermark, mimetype: 'video/mp4', ...options });
      } else if (quoted.mtype === 'audioMessage') {
        conn.sendMessage(m.chat, { audio: mediax, caption: watermark, mimetype: 'audio/mpeg', fileName: 'Hidetag.mp3', ...options });
      } else if (quoted.mtype === 'stickerMessage') {
        conn.sendMessage(m.chat, { sticker: mediax, ...options });
      }
    } else {
      const more = String.fromCharCode(8206);
      const masss = more.repeat(850) + watermark;

      await conn.relayMessage(
        m.chat,
        {
          extendedTextMessage: {
            text: `${masss}`,
            contextInfo: {
              mentionedJid: users,
              externalAdReply: {
                thumbnail: 'https://telegra.ph/file/03d1e7fc24e1a72c60714.jpg',
                sourceUrl: global.canal
              }
            }
          }
        },
        {}
      );
    }
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
