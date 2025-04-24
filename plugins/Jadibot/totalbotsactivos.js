import ws from 'ws';
import fs, { readdirSync } from 'fs';
import path from 'path';

let confirm = {}

let handler = async (m, { conn, usedPrefix, args, participants }) => {
  await conn.sendMessage(m.chat, { react: { text: "🤖", key: m.key }});

  const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
  const txto = await Promise.all(users.map(async (v, index) => {
    let uptime = await ajusteTiempo(Date.now() - v.uptime);
    return `*${index + 1}. 💻* @${v.user.jid.replace(/[^0-9]/g, '')}\n*Activo :* ${uptime}`;
  }));
  let message = txto.join('\n\n');
  const replyMessage = (message.length === 0 || message.length === undefined) ? '' : message;
  
  let totalUsers = global.conns === undefined ? '0' : users.length;

  let SB = `*ProyectoX // EBG*\n*Conectados: ${totalUsers || '0'}*\n\n${replyMessage.trim()}`

  let int = '';
  let count = 0;
  for (const c of SB) {
    await new Promise(resolve => setTimeout(resolve, 1));
    int += c;
    count++;
    if (count % 10 === 0) {
      await conn.sendPresenceUpdate('composing', m.chat);
    }
  }

  let q = await conn.sendMessage(m.chat, { text: SB, mentions: conn.parseMention(SB) }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 });

  confirm[m.sender] = {
    sender: m.sender,
    q: q,
    totalUsers: totalUsers,
    time: setTimeout(async () => {
      delete confirm[m.sender]
    }, 60 * 1000)
  }

  console.log('SubbotsInfo: ', confirm)
}

handler.command = /^(subs|sub)$/i
handler.tags = ['jadibot']
handler.help = ['subs', 'sub']

handler.before = async function before (m, { conn }) {
  if (m.text.toLowerCase() === 'botsmain') {
    const confirmacion = Object.values(confirm).find(c => c.sender === m.sender);
    if (!confirmacion) return;

    await conn.sendMessage(m.chat, { react: { text: "🤖", key: m.key }});

    let bots = '';
    for (let i of readdirSync(global.authFolderAniMX)) {
      var bot = i.match(/\d+/g);
      if (bot) {
        bots += `@${bot[0]}\n`;
      }
    }
    bots = bots.trim();

    await conn.sendMessage(m.chat, {
      text: `Bots actuales:\n${bots}`,
      mentions: conn.parseMention(bots)
    }, {
      quoted: m,
      ephemeralExpiration: 24 * 60 * 100,
      disappearingMessagesInChat: 24 *
