const BOTS_EXCLUIDOS = ['573243951424@s.whatsapp.net']; // Lista de bots que NO deben bloquear

export async function before(m, { isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes("PIEDRA") || m.text.includes("PAPEL") || m.text.includes("TIJERA")) return !0;

  let bot = global.db.data.settings[this.user.jid] || {};

  // Verifica si el bot actual (receptor) está en la lista de excluidos
  if (BOTS_EXCLUIDOS.includes(this.user.jid)) return !0;

  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(
      `» 𝗘𝗦𝗧𝗔 𝗣𝗥𝗢𝗛𝗜𝗕𝗜𝗗𝗢 𝗘𝗦𝗖𝗥𝗜𝗕𝗜𝗥𝗟𝗘 𝗔𝗟 𝗕𝗢𝗧 𝗔𝗟 𝗣𝗥𝗜𝗩𝗔𝗗𝗢, 𝗦𝗘𝗥𝗔́𝗦 𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢/𝗔 .
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
» 𝗦𝗜 𝗡𝗘𝗖𝗘𝗦𝗜𝗧𝗔𝗦 𝗨𝗡 𝗕𝗢𝗧 𝗢 𝗧𝗜𝗘𝗡𝗘𝗦 𝗔𝗟𝗚Ú𝗡 𝗜𝗡𝗖𝗢𝗡𝗩𝗘𝗡𝗜𝗘𝗡𝗧𝗘 𝗖𝗢𝗡𝗧Á𝗖𝗧𝗔𝗧𝗘 𝗖𝗢𝗡 𝗠𝗜 𝗖𝗥𝗘𝗔𝗗𝗢𝗥.
» Wa.me/593993370003`,
      false,
      { mentions: [m.sender] }
    );
    await this.updateBlockStatus(m.chat, 'block');
  }

  return !1;
}
