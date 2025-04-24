import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const watermark = '\nㅤㅤㅤㅤㅤㅤㅤㅤㅤᴱˡᶦᵗᵉᴮᵒᵗᴳˡᵒᵇᵃˡ';
    const messageText = text || '';

    // Crear mensaje base con menciones
    const baseMsg = {
      text: messageText + watermark,
      mentions: users,
      footer: 'Selecciona una opción:',
      buttons: [
        {buttonId: 'mention', buttonText: {displayText: '👤 Mención'}, type: 1},
        {buttonId: 'reminder', buttonText: {displayText: '📝 Recordatorio'}, type: 1}
      ],
      headerType: 1
    };

    // Si hay mensaje citado o multimedia
    const q = m.quoted ? m.quoted : m;
    const c = m.quoted ? await m.getQuotedObj() : m.msg;
    
    if (m.quoted) {
      const mime = (q.msg || q).mimetype || '';
      const isMedia = /image|video|sticker|audio/.test(mime);
      
      if (isMedia) {
        const mediax = await q.download?.();
        const options = { 
          mentions: users,
          caption: messageText + watermark,
          footer: 'Selecciona una opción:',
          buttons: [
            {buttonId: 'mention', buttonText: {displayText: '👤 Mención'}, type: 1},
            {buttonId: 'reminder', buttonText: {displayText: '📝 Recordatorio'}, type: 1}
          ]
        };

        if (q.mtype === 'imageMessage') {
          return conn.sendMessage(m.chat, { image: mediax, ...options });
        } else if (q.mtype === 'videoMessage') {
          return conn.sendMessage(m.chat, { video: mediax, mimetype: 'video/mp4', ...options });
        } else if (q.mtype === 'audioMessage') {
          return conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mpeg', ...options });
        } else if (q.mtype === 'stickerMessage') {
          return conn.sendMessage(m.chat, { sticker: mediax, ...options });
        }
      }
    }

    // Envío para texto simple o mensajes no multimedia
    await conn.sendMessage(m.chat, baseMsg);

  } catch (error) {
    console.error('Error en el comando notifica:', error);
    m.reply('*[❗] Ocurrió un error al enviar la notificación. Por favor intente nuevamente.*');
  }
};

handler.help = ['notifica'];
handler.tags = ['group'];
handler.command = /^notifica$/i;
handler.group = true;
handler.admin = true;

export default handler;
