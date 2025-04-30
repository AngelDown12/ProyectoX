import * as fs from 'fs';

const handler = async (m, { conn, text, participants }) => {
  const users = participants.map((u) => conn.decodeJid(u.id));
  const quoted = m.quoted;

  if (!quoted) {
    // Si no se responde a nada, solo menciona con texto
    return await conn.sendMessage(m.chat, {
      text: text || '',
      mentions: users
    }, { quoted: m });
  }

  const mime = (quoted.msg || quoted).mimetype || '';
  const isMedia = /image|video|sticker|audio/.test(mime);
  const options = { mentions: users, quoted: m };

  try {
    if (isMedia) {
      const media = await quoted.download();

      if (quoted.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, {
          image: media,
          caption: text || '',
          ...options
        });
      } else if (quoted.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, {
          video: media,
          caption: text || '',
          mimetype: 'video/mp4',
          ...options
        });
      } else if (quoted.mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, {
          audio: media,
          mimetype: 'audio/mpeg',
          ptt: true,
          ...options
        });
      } else if (quoted.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, {
          sticker: media,
          ...options
        });
      }
    } else {
      // Si no es multimedia, reenvía texto con menciones
      await conn.sendMessage(m.chat, {
        text: text || quoted.text || '',
        mentions: users
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: 'Error al procesar el comando.',
      quoted: m
    });
  }
};

handler.help = ['notify'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
