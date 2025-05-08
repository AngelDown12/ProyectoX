import moment from 'moment-timezone';
import os from 'os';
import { performance } from 'perf_hooks';

const handler = async (m, { conn, usedPrefix, command }) => {
  const name = await conn.getName(m.sender);
  const date = moment().tz('America/Guayaquil');
  const uptime = process.uptime() * 1000;
  const muptime = performance.now();
  
  const totalUsers = Object.keys(global.db.data.users).length;
  const totalReg = Object.values(global.db.data.users).filter(user => user.registered === true).length;
  const totalPlugins = Object.keys(global.plugins).length;

  // Crear estructura de categorías
  const categories = {};
  for (const [pluginName, plugin] of Object.entries(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue;
    for (const tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = [];
      categories[tag].push(...plugin.help);
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

  // Encabezado del menú
  let menuText = `╭━━〔 *Menú de ${name}* 〕━━⬣
┃ 🧿 *Versión:* ${global.packname}
┃ ⏳ *Tiempo Activo:* ${clockString(uptime)}
┃ 📊 *Usuarios Registrados:* ${totalReg}/${totalUsers}
┃ ⚙️ *Comandos Cargados:* ${totalPlugins}
┃ 📅 *Fecha:* ${date.format('DD/MM/YYYY')}
┃ ⏰ *Hora:* ${date.format('HH:mm:ss')}
╰━━━━━━━━━━━━━━━━━━⬣\n\n`;

  // Construir secciones por categoría
  for (const [tag, cmds] of Object.entries(categories)) {
    menuText += `╭─❏ ${tagEmojis[tag] || '❏'} *${tag.toUpperCase()}*\n`;
    for (const cmd of cmds) {
      menuText += `┃ ➤ ${usedPrefix}${cmd}\n`;
    }
    menuText += `╰───────────────\n\n`;
  }

  // Pie del menú
  menuText += `╭━〔 *GataBot-MD* 〕━⬣
┃ 🐈‍⬛ _Recuerda usar el prefijo:_ ${usedPrefix}
╰━━━━━━━━━━━━━━━━⬣`;

  // Mensaje tipo respuesta
  const fmsg = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      ...(m.chat ? { remoteJid: m.chat } : {})
    },
    message: {
      extendedTextMessage: {
        text: 'GataBot-MD'
      }
    }
  };

  // Enviar como mensaje de texto largo
  await conn.sendMessage(m.chat, { text: menuText }, { quoted: fmsg });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', '?'];

export default handler;

// Función para convertir ms a formato HH:MM:SS
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    }
