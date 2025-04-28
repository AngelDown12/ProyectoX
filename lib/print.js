import { WAMessageStubType } from '@whiskeysockets/baileys'; import PhoneNumber from 'awesome-phonenumber'; import chalk from 'chalk'; import { watchFile } from 'fs'; import '../config.js';

const terminalImage = global.opts['img'] ? require('terminal-image') : ''; const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {

let name_user; let _name = await conn.getName(m.sender) || 'Anónimo'; let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') === undefined ? '' : PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name == PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') ? '' : ' ~' + _name); let chat = await conn.getName(m.chat); let img;

try { if (global.opts['img']) img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false; } catch (e) { console.error(e); }

let user = global.db.data.users[m.sender]; let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international');

name_user = m.messageStubParameters.map(jid => { let usuario_info = conn.decodeJid(jid); let name_info = conn.getName(jid); return chalk.bold(${name_info ? name_info : mid.idioma_code === 'es' ? 'Alguien' : 'Someone'}); }).join(', ');

console.log( ╭━━━━━━━━━━━━━━𖡼 ┃ ❖ ${chalk.white.bold('Bot:')} ${chalk.cyan.bold('%s')} ┃ ❖ ${chalk.white.bold(mid.idioma_code === 'es' ? 'Acción:' : 'Action:')} ${mid.idioma_code === 'es' ? await formatMessageStubType(m.messageStubType, name_user) : await formaTxtStub(WAMessageStubType[m.messageStubType])} ┃ ❖ ${chalk.white.bold(mid.idioma_code === 'es' ? 'Usuario:' : 'User:')} ${chalk.white('%s')} / ${chalk.bgMagentaBright.bold(user.role.replace(/\*/g, ''))} ┃ ❖ %s ┃ ❖ ${chalk.white.bold(mid.idioma_code === 'es' ? 'Tipo de mensaje:' : 'Type of message')} ${chalk.bgBlueBright.bold('[%s]')} %s ╰━━━━━━━━━━━━━━𖡼.trim(),

me + (conn.user.name == undefined ? '' : ' ~' + conn.user.name) + `${conn.user.jid == global.conn.user.jid ? '' : ' 【𝗚𝗕 - 𝗦𝗨𝗕 𝗕𝗢𝗧】'}`,
(m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toTimeString(),
sender,
m ? '' : '',
mid.idioma_code === 'es' ? await formatMessageTypes(m.mtype) : await formaTxt(m.mtype) || 'Not specified',
m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? (m.message?.extendedTextMessage?.contextInfo?.participant == m.sender
  ? '┃ ❖ ' + chalk.bold(`${conn.getName(m.sender) ?? user.name ?? 'Este usuario'}`) + ' respondió a su propio mensaje.'
  : '┃ ❖ ' + chalk.bold(`${conn.getName(m.sender) ?? user.name ?? 'Este usuario'}`) + (!m.message?.extendedTextMessage?.contextInfo?.participant.includes("newsletter")
    ? ' respondió a ' + chalk.bold(`${conn.getName(m.message?.extendedTextMessage?.contextInfo?.participant) ?? m.message?.extendedTextMessage?.contextInfo?.participant ?? 'Usuario desconocido'}`)
    : ' envió mensaje en el canal'))
  : ''

);

if (img) console.log(img.trimEnd());

if (typeof m.text === 'string' && m.text) { let log = m.text.replace(/\u200e+/g, '');

const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~`])(?!`)(.+?)\1|```((?:.|[\n\r])+?)```|`([^`]+?)`)(?=\S?(?:[\s\n]|$))/g;
const mdFormat = (depth = 4) => (_, type, text, monospace) => {
  const types = {
    '_': 'italic',
    '*': 'bold',
    '~': 'strikethrough',
    '`': 'bgGray'
  };
  text = text || monospace;
  return !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(/`/g, '').replace(mdRegex, mdFormat(depth - 1)));
};

log = log.replace(mdRegex, mdFormat(4));
log = log.split('\n').map(line => {
  if (line.trim().startsWith('>')) {
    return chalk.bgGray.dim(line.replace(/^>/, '┃'));
  } else if (/^([1-9]|[1-9][0-9])\./.test(line.trim())) {
    return line.replace(/^(\d+)\./, (match, number) => {
      const padding = number.length === 1 ? '  ' : ' ';
      return padding + number + '.';
    });
  } else if (/^[-*]\s/.test(line.trim())) {
    return line.replace(/^[-*]/, '  •');
  }
  return line;
}).join('\n');

if (log.length < 1024)
  log = log.replace(urlRegex, (url, i, text) => {
    let end = url.length + i;
    return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url;
  });

if (m.mentionedJid) for (let user of m.mentionedJid) log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await conn.getName(user)));
console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);

}

if (m.messageStubParameters) { console.log(m.messageStubParameters.map(jid => { jid = conn.decodeJid(jid); let name = conn.getName(jid); const phoneNumber = PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'); return name ? chalk.gray(${phoneNumber} (${name})) : ''; }).filter(Boolean).join(', ')); }

if (/document/i.test(m.mtype)) console.log(🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}); else if (/ContactsArray/i.test(m.mtype)) console.log(👨‍👩‍👧‍👦); else if (/contact/i.test(m.mtype)) console.log(👨 ${m.msg.displayName || ''}); else if (/audio/i.test(m.mtype)) { const duration = m.msg.seconds; console.log(${m.msg.ptt ? '🎤ㅤ(PTT ' : '🎵ㅤ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}); } console.log(); }

let file = global.__filename(import.meta.url); watchFile(file, () => { console.log(chalk.redBright("Update 'lib/print.js'")); });

// (Format functions no fueron modificadas)

