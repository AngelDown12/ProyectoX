import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? await m.getQuotedObj() : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);

    const options = {
      mentions: users,
      quoted: m
    };

    if (isMedia) {
      const mediax = await quoted.download?.();
      
      // Añadir texto como caption si existe
      if (text) {
        options.caption = text;
      }

      switch (quoted.mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: mediax, ...options });
          break;
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: mediax, mimetype: 'video/mp4', ...options });
          break;
        case 'audioMessage':
          await conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mpeg', ptt: true, ...options });
          break;
        case 'stickerMessage':
          await conn.sendMessage(m.chat, { sticker: mediax, ...options });
          break;
      }
    } else {
      // Mensaje de texto normal
      const messageText = text || quoted.text || '';
      await conn.sendMessage(
        m.chat, 
        { 
          text: messageText, 
          mentions: users 
        }, 
        { quoted: m }
      );
    }
  } catch (error) {
    console.error('Error en el comando:', error);
    await conn.sendMessage(
      m.chat, 
      { 
        text: '❌ Ocurrió un error al procesar el mensaje.', 
        mentions: participants.map(u => conn.decodeJid(u.id)) 
      }, 
      { quoted: m }
    );
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
