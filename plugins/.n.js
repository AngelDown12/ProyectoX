const handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id));
  const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';

  try {
    if (!m.quoted || !m.quoted.message) throw 'Responde a un mensaje para enviarlo con oculto.';

    const quoted = m.quoted;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const options = { mentions: users, quoted };

    if (isMedia) {
      const media = await quoted.download?.();
      if (!media) throw 'No se pudo descargar el archivo multimedia.';

      switch (quoted.mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: media, caption: (text || '') + watermark, ...options });
          break;
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: media, caption: (text || '') + watermark, mimetype: 'video/mp4', ...options });
          break;
        case 'audioMessage':
          await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', ptt: true, ...options });
          break;
        case 'stickerMessage':
          await conn.sendMessage(m.chat, { sticker: media, ...options });
          break;
        default:
          throw 'Tipo de archivo no compatible.';
      }
    } else {
      await conn.sendMessage(m.chat, { text: (text || '') + watermark, mentions: users }, { quoted });
    }

  } catch (e) {
    console.error(e);
    m.reply(typeof e === 'string' ? e : 'Ocurrió un error al ejecutar el comando.');
  }
};

handler.help = ['nn', 'notify', 'notificar', 'notif'];
handler.tags = ['group'];
handler.command = /^(nn|notify|notificar|notif)$/i;
handler.group = true;
handler.admin = true;

export default handler;
