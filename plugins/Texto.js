const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const flagMap = [
  ['598', '🇺🇾'], ['595', '🇵🇾'], ['593', '🇪🇨'], ['591', '🇧🇴'],
  ['590', '🇧🇶'], ['509', '🇭🇹'], ['507', '🇵🇦'], ['506', '🇨🇷'],
  ['505', '🇳🇮'], ['504', '🇭🇳'], ['503', '🇸🇻'], ['502', '🇬🇹'],
  ['501', '🇧🇿'], ['599', '🇨🇼'], ['597', '🇸🇷'], ['596', '🇬🇫'],
  ['594', '🇬🇫'], ['592', '🇬🇾'], ['590', '🇬🇵'], ['549', '🇦🇷'],
  ['58', '🇻🇪'], ['57', '🇨🇴'], ['56', '🇨🇱'], ['55', '🇧🇷'],
  ['54', '🇦🇷'], ['53', '🇨🇺'], ['52', '🇲🇽'], ['51', '🇵🇪'],
  ['34', '🇪🇸'], ['1', '🇺🇸']
];

function numberWithFlag(num) {
  const clean = num.replace(/[^0-9]/g, '');
  for (const [code, flag] of flagMap) {
    if (clean.startsWith(code)) return `${num} ${flag}`;
  }
  return num;
}

async function niceName(jid, conn, chatId, fallback = '') {
  try {
    const name = await conn.getName(jid);
    if (name && name.trim() && !/^\d+$/.test(name)) return name;
  } catch {}
  const contact = conn.contacts?.[jid] || {};
  if (contact.notify && !/^\d+$/.test(contact.notify)) return contact.notify;
  if (fallback && fallback.trim()) return fallback;
  return numberWithFlag(jid.split('@')[0]);
}

const colores = {
  rojo: ['#F44336', '#FFCDD2'],
  azul: ['#00B4DB', '#0083B0'],
  verde: ['#4CAF50', '#C8E6C9'],
  rosa: ['#E91E63', '#F8BBD0'],
  morado: ['#9C27B0', '#E1BEE7'],
  negro: ['#212121', '#9E9E9E'],
  naranja: ['#FF9800', '#FFE0B2'],
  gris: ['#607D8B', '#CFD8DC'],
  celeste: ['#00FFFF', '#E0FFFF']
};

const handler = async (m, { conn, text, args }) => {
  const chatId = m.chat;
  const quoted = m.quoted;
  let targetJid = m.sender;
  let fallbackName = m.pushName;
  let quotedName = '';
  let quotedText = '';

  if (quoted) {
    targetJid = quoted.sender;
    quotedText = quoted.text || '';
    quotedName = quoted.name || '';
    fallbackName = '';
  }

  const fullText = text.trim();
  const firstWord = fullText.split(' ')[0]?.toLowerCase();
  const gradColors = colores[firstWord] || colores['azul'];

  let content = '';
  if (colores[firstWord]) {
    content = fullText.split(' ').slice(1).join(' ').trim() || quotedText || '';
  } else {
    content = fullText || quotedText || '';
  }

  if (!content) {
    return m.reply(`✏️ Usa el comando así:\n\n*.texto [color opcional] tu mensaje*\n\nEjemplos:\n- .texto azul Hola grupo\n- .texto Buenos días a todos\n\nColores disponibles:\n${Object.keys(colores).join(', ')}`);
  }

  const displayName = await niceName(targetJid, conn, chatId, quotedName || fallbackName);

  let avatarUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
  try {
    avatarUrl = await conn.profilePictureUrl(targetJid, 'image');
  } catch {}

  await conn.sendMessage(chatId, { react: { text: '🖼️', key: m.key }});

  const canvas = createCanvas(1080, 1080);
  const draw = canvas.getContext('2d');

  const grad = draw.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, gradColors[0]);
  grad.addColorStop(1, gradColors[1]);
  draw.fillStyle = grad;
  draw.fillRect(0, 0, 1080, 1080);

  const avatar = await loadImage(avatarUrl);
  draw.save();
  draw.beginPath();
  draw.arc(100, 100, 80, 0, Math.PI * 2);
  draw.clip();
  draw.drawImage(avatar, 20, 20, 160, 160);
  draw.restore();

  draw.font = 'bold 40px Sans-serif';
  draw.fillStyle = '#ffffff';
  draw.fillText(displayName, 220, 100);

  draw.font = 'bold 60px Sans-serif';
  draw.fillStyle = '#ffffff';
  draw.textAlign = 'center';

  const words = content.split(' ');
  let line = '', lines = [];
  for (const word of words) {
    const testLine = line + word + ' ';
    if (draw.measureText(testLine).width > 900) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  if (line.trim()) lines.push(line.trim());

  const startY = 550 - (lines.length * 35);
  lines.forEach((l, i) => draw.fillText(l, 540, startY + (i * 80)));

  const logo = await loadImage('https://cdn.russellxz.click/a46036ec.png');
  const logoWidth = 140;
  const logoHeight = 140;
  const x = canvas.width - logoWidth - 40;
  const y = canvas.height - logoHeight - 40;
  draw.drawImage(logo, x, y, logoWidth, logoHeight);

  const fileName = `./tmp/texto-${Date.now()}.png`;
  const out = fs.createWriteStream(fileName);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', async () => {
    await conn.sendFile(chatId, fileName, 'imagen.png', `🖼 Generado por GataBot`, m);
    fs.unlinkSync(fileName);
  });
};

handler.help = ['texto [color] [texto o cita]'];
handler.tags = ['editor'];
handler.command = /^texto$/i;

module.exports = handler;
