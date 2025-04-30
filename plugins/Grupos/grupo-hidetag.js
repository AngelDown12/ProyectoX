const handler = async (m, { conn, text, participants }) => {
  try {
    if (!m.quoted) throw 'Debes responder a un mensaje';

    const users = participants.map(u => conn.decodeJid(u.id));
    const quoted = m.quoted;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ'; // Puedes personalizar esto

    const options = { mentions: users, quoted: quoted };

    if (isMedia) {
      const media = await quoted.download?.();

      if (quoted.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, caption: (text || '') + watermark, ...options });
      } else if (quoted.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, caption: (text || '') + watermark, mimetype: 'video/mp4', ...options });
      } else if (quoted.mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', ptt: true, ...options });
      } else if (quoted.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { sticker: media, ...options });
      }
    } else {
      await conn.sendMessage(m.chat, {
        text: (text || '') + watermark,
        mentions: users
      }, {
        quoted: quoted
      });
    }
  } catch (e) {
    console.error(e);
    m.reply('Ocurrió un error al procesar el comando.');
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
