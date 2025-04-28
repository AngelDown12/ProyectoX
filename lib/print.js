import { WAMessageStubType } from '@whiskeysockets/baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
  let _name = await conn.getName(m.sender);
  let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '');
  let chat = await conn.getName(m.chat);
  let img;

  try {
    if (global.opts['img']) {
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
    }
  } catch (e) {
    console.error(e);
  }

  let filesize = (m.msg ?
    m.msg.vcard ? m.msg.vcard.length :
    m.msg.fileLength ? m.msg.fileLength.low || m.msg.fileLength :
    m.msg.axolotlSenderKeyDistributionMessage ? m.msg.axolotlSenderKeyDistributionMessage.length :
    m.text ? m.text.length : 0
    : m.text ? m.text.length : 0) || 0;

  let user = global.db.data.users[m.sender];
  let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international');

  // Consola Hacker Adornada
  console.log(chalk.greenBright('╭━━━[ 𓃠 NEW MESSAGE RECEIVED ]━━━━━━╮'));
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('Bot')}      : ${chalk.magentaBright(me + ' ~' + conn.user.name)}${conn.user.jid == global.conn.user.jid ? '' : chalk.gray(' (GB-SUB)')}`);
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('Time')}     : ${chalk.yellowBright((m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toTimeString().split(' ')[0])}`);
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('Type')}     : ${chalk.blueBright(m.messageStubType ? WAMessageStubType[m.messageStubType] : '-')}`);
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('Sender')}   : ${chalk.whiteBright(sender)}`);
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('Chat')}     : ${chalk.white(chat ? m.chat + ' ~ ' + chat : m.chat)}`);
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('Size')}     : ${chalk.gray(filesize)} ${chalk.green('[' + (filesize === 0 ? 0 : (filesize / 1000 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)) + (['', 'K', 'M', 'G', 'T', 'P'][Math.floor(Math.log(filesize) / Math.log(1000))] || '') + 'B]')}`);
  console.log(`${chalk.greenBright('┃')} ${chalk.cyan('EXP')}      : ${chalk.green(m ? m.exp : '?')} ${user ? chalk.gray('| ' + user.exp + ' | $' + user.money) : ''}`);
  console.log(`${chalk.greenBright('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯')}`);

  if (img) console.log(img.trimEnd());

  // Contenido del Mensaje
  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '');
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
      text = text || monospace;
      return !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
    };

    if (log.length < 1024) {
      log = log.replace(urlRegex, (url, i, text) => {
        let end = url.length + i;
        return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url;
      });
    }
    log = log.replace(mdRegex, mdFormat(4));

    if (m.mentionedJid) {
      for (let user of m.mentionedJid) {
        log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await conn.getName(user)));
      }
    }

    console.log(chalk.greenBright('📝 Message Content:'));
    console.log(m.error != null ? chalk.redBright(log) : m.isCommand ? chalk.yellowBright(log) : chalk.whiteBright(log));
  }

  // Otros datos
  if (m.messageStubParameters) {
    console.log(m.messageStubParameters.map(jid => {
      jid = conn.decodeJid(jid);
      let name = conn.getName(jid);
      return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''));
    }).join(', '));
  }

  if (/document/i.test(m.mtype)) console.log(chalk.cyan('🗂️ Document: ') + (m.msg.fileName || m.msg.displayName || 'Document'));
  else if (/ContactsArray/i.test(m.mtype)) console.log(chalk.cyan('👥 Contacts Group'));
  else if (/contact/i.test(m.mtype)) console.log(chalk.cyan('👤 Contact: ') + (m.msg.displayName || ''));
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds;
    console.log(`${chalk.cyan(m.msg.ptt ? '🎤 (PTT AUDIO)' : '🎵 (AUDIO)')} ${chalk.gray(Math.floor(duration / 60).toString().padStart(2, '0') + ':' + (duration % 60).toString().padStart(2, '0'))}`);
  }

  console.log();
}

const file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.redBright("⚡ Update detected in 'lib/print.js' ⚡"));
});
