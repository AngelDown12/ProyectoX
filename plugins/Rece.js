Perfecto. Vamos a hacerlo en dos partes:


---

1. Plugin emisor para Subbots (envía señal al bot principal)

Este plugin se ejecuta en todos los bots, pero solo los subbots enviarán una “señal” al bot principal cuando bloqueen.

const BOT_PRINCIPAL = '593986304370@s.whatsapp.net'; // JID del bot principal

export async function before(m, { isOwner, isROwner, conn }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup || !m.message) return !0;

  const bot = global.db.data.settings[conn.user.jid] || {};
  if (!bot.antiPrivate || isOwner || isROwner) return !1;

  const fecha = new Date().toLocaleString('es-EC', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mensaje = m.text || '(mensaje vacío)';

  // Solo subbots envían esta señal
  if (conn.user.jid !== BOT_PRINCIPAL) {
    await conn.sendMessage(BOT_PRINCIPAL, {
      text: `/notibloqueo ${m.sender}|${conn.user.jid}|${fecha}|${mensaje}`
    });
  }

  await conn.updateBlockStatus(m.chat, 'block');
  return !1;
}


---

2. Plugin receptor en el Bot Principal (detecta señal y notifica al grupo)

const GRUPO_NOTIFICACION = '120363360571564799@g.us'; // ID del grupo de bloqueos

const handler = async (m, { conn }) => {
  if (!m.text.startsWith('/notibloqueo')) return;

  const [_, payload] = m.text.split(' ', 2);
  const [bloqueado, botJid, fecha, mensaje] = payload.split('|');

  const userMention = '@' + bloqueado.split('@')[0];
  const botName = global.db.data.settings[botJid]?.botName || botJid.split('@')[0];

  await conn.sendMessage(GRUPO_NOTIFICACION, {
    text: `*Notificación de bloqueo*\n\n` +
          `*Usuario bloqueado:* ${userMention}\n` +
          `*Bot que realizó el bloqueo:* ${botName}\n` +
          `*Motivo:* Mensaje en privado\n` +
          `*Fecha:* ${fecha}\n` +
          `*Mensaje:* ${mensaje}`,
    mentions: [bloqueado]
  });
};

handler.customPrefix = /^\/notibloqueo /;
handler.command = new RegExp;
handler.fromMe = true;

export default handler;


---

¿Deseas que también incluya el nombre del bot en el mensaje si lo tienes en la configuración (botName) o lo dejamos con el JID?

                                        
