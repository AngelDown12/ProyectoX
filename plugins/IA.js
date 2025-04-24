import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) throw `*${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉𝘼 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉 𝙊 𝙐𝙉𝘼 𝙊𝙍𝘿𝙀𝙉 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝘽𝘼𝙍𝘿*\n\n❏ �𝙀𝙅𝙀𝙈𝙋𝙇𝙊 �𝙀 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉𝙀𝙎 𝙔 𝙊𝙍𝘿𝙀𝙉𝙀𝙎\n❏ *${usedPrefix + command}* Recomienda un top 10 de películas de acción\n❏ *${usedPrefix + command}* Codigo en JS para un juego de cartas`;

  try {
    conn.sendPresenceUpdate('composing', m.chat);
    const apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`);
    const res = await apii.json();
    await m.reply(res.result);
  } catch (e) {
    await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*\n\n${wm}`, fkontak, m);
    console.error(`❗❗ ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}* ❗❗`, e);
  }
};

// Configuración para usar sin punto (customPrefix)
handler.customPrefix = /^[^.]/i; // Acepta cualquier comando que NO empiece con punto
handler.command = ['bard', 'gemini'];
handler.help = ['bard', 'gemini'];
handler.tags = ['herramientas'];
handler.premium = false;

export default handler;
