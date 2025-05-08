import moment from 'moment-timezone';
import os from 'os';
import { performance } from 'perf_hooks';

const handler = async (m, { conn, usedPrefix, command }) => {
  const name = await conn.getName(m.sender);
  const date = moment().tz('America/Guayaquil');
  const uptime = process.uptime() * 1000;

  const totalUsers = Object.keys(global.db.data.users).length;
  const totalReg = Object.values(global.db.data.users).filter(user => user.registered === true).length;
  const totalPlugins = Object.keys(global.plugins).length;

  // Categorías y comandos
  const categories = {};
  for (const [pluginName, plugin] of Object.entries(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue;
    for (const tag of plugin.tags) {
      if (!(tag in categories)) categories[tag] = [];
      categories[tag].push(...plugin.help.map(cmd => `${usedPrefix}${cmd}`));
    }
  }

  const tagEmojis = {
    'main': '✨',
    'owner': '👑',
    'fun': '🤣',
    'game': '🎮',
    'xp': '🧬',
    'sticker': '🌀',
    'audio': '🎧',
    'tool': '🛠️',
    'info': '📚',
    'admin': '🛡️',
    'group': '👥',
    'premium': '💎',
    'internet': '🌐',
    'anime': '🍙',
    'search': '🔎',
    'random': '🎲',
    'nsfw': '🔞'
  };

  let txt = `╭━━〔 *Menú de ${name}* 〕━━⬣
┃ 🧿 *Versión:* ${global.packname}
┃ ⏳ *Activo:* ${clockString(uptime)}
┃ 📊 *Usuarios:* ${totalReg}/${totalUsers}
┃ ⚙️ *Comandos:* ${totalPlugins}
┃ 📅 *Fecha:* ${date.format('DD/MM/YYYY')}
┃ ⏰ *Hora:* ${date.format('HH:mm:ss')}
╰━━━━━━━━━━━━━━━━━━⬣\n\n`;

  for (const [tag, cmds] of Object.entries(categories)) {
    txt += `╭─❏ ${tagEmojis[tag] || '❏'} *${tag.toUpperCase()}*\n`;
    for (const cmd of cmds) {
      txt += `┃ ➤ ${cmd}\n`;
    }
    txt += `╰───────────────\n\n`;
  }

  txt += `╭━〔 *GataBot-MD* 〕━⬣
┃ 🐈‍⬛ _Usa siempre el prefijo:_ ${usedPrefix}
╰━━━━━━━━━━━━━━━━⬣`;

  const imageUrl = 'https://telegra.ph/file/1ee204eeccf157f3e4882.jpg'; // cambia esto por tu imagen si quieres

  await conn.sendFile(m.chat, imageUrl, 'menu.jpg', txt, m);
};

handler.help = ['menu2'];
handler.tags = ['main'];
handler.command = ['menu2'];

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
