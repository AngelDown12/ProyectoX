const NUMERO_EXCLUIDO = '573243951424@s.whatsapp.net'; // Bot principal
const GRUPO_NOTIFICACION = '120363360571564799@g.us'; // ID del grupo donde se notificará el bloqueo

export async function before(m, { isOwner, isROwner, conn }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes("PIEDRA") || m.text.includes("PAPEL") || m.text.includes("TIJERA")) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};
  if (m.sender === NUMERO_EXCLUIDO) return !0;

  if (bot.antiPrivate && !isOwner && !isROwner) {
    const userMention = '@' + m.sender.split('@')[0];
    const fecha = new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const videos = [
      'https://files.catbox.moe/tpmd88.mp4',
      'https://files.catbox.moe/9k06vj.mp4',
      'https://files.catbox.moe/zl8h3y.mp4'
    ];
    const videoRandom = videos[Math.floor(Math.random() * videos.length)];

    await conn.sendMessage(m.chat, {
      video: { url: videoRandom },
      caption: `Hola ${userMention}\n\nEstá prohibido escribirme al privado, por ende serás bloqueado.\n\nFuiste bloqueado\n(${fecha})\n\n` +
               `» Si necesitas un bot o tienes algún inconveniente, contáctate con mi creador:\n` +
               `» wa.me/593993370003`,
      gifPlayback: true,
      mentions: [m.sender]
    }, { quoted: m });

    await conn.updateBlockStatus(m.chat, 'block');

    // Notificación al grupo
    await conn.sendMessage(GRUPO_NOTIFICACION, {
      text: `El bot ha bloqueado a @${m.sender.split('@')[0]} por escribirle al privado.`,
      mentions: [m.sender]
    });
  }

  return !1;
}
