const BOTS_EXCLUIDOS = ['573243951424@s.whatsapp.net']; // Lista de bots que NO deben bloquear

const VIDEOS = [
  'https://files.catbox.moe/tpmd88.mp4',
  'https://files.catbox.moe/1a2b3c.mp4', // Reemplaza con tu segundo video
  'https://files.catbox.moe/4d5e6f.mp4'  // Reemplaza con tu tercer video
];

export async function before(m, { isOwner, isROwner, conn }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes("PIEDRA") || m.text.includes("PAPEL") || m.text.includes("TIJERA")) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};

  // Si el bot actual está en la lista de excluidos, no hace nada
  if (BOTS_EXCLUIDOS.includes(this.user.jid)) return !0;

  if (bot.antiPrivate && !isOwner && !isROwner) {
    const fecha = new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const videoAleatorio = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];

    await conn.sendMessage(m.chat, {
      video: { url: videoAleatorio },
      caption: `Hola @${m.sender.split('@')[0]}\n\n` +
               `Está prohibido escribirme al privado, por ende serás bloqueado.\n\n` +
               `Fuiste bloqueado\n(${fecha})\n\n` +
               `» Si necesitas un bot o tienes algún inconveniente, contáctate con mi creador:\n` +
               `» wa.me/593993370003`,
      gifPlayback: true,
      mentions: [m.sender]
    }, { quoted: m });

    await conn.updateBlockStatus(m.chat, 'block');
  }

  return !1;
}
