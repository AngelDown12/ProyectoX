import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

const colores = {
  azul: ['#00B4DB', '#0083B0'],
  rojo: ['#F44336', '#FFCDD2'],
  verde: ['#4CAF50', '#C8E6C9'],
  rosa: ['#E91E63', '#F8BBD0'],
  morado: ['#9C27B0', '#E1BEE7'],
  negro: ['#212121', '#9E9E9E'],
  naranja: ['#FF9800', '#FFE0B2'],
  gris: ['#607D8B', '#CFD8DC'],
  celeste: ['#00FFFF', '#E0FFFF']
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const colorElegido = colores[args[0]?.toLowerCase()] || colores.azul;
  const texto = colores[args[0]?.toLowerCase()] ? args.slice(1).join(' ') : args.join(' ');

  if (!texto) {
    return m.reply(
      `✏️ *Uso correcto del comando:*\n\n` +
      `*${usedPrefix + command} [color opcional] texto*\n\n` +
      `*Ejemplos:*\n` +
      `- ${usedPrefix + command} azul Hola a todos\n` +
      `- ${usedPrefix + command} Buenos días grupo\n\n` +
      `*Colores disponibles:*\n${Object.keys(colores).join(', ')}`
    );
  }

  const avatarURL = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, colorElegido[0]);
  grad.addColorStop(1, colorElegido[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  const avatar = await loadImage(avatarURL);
  ctx.drawImage(avatar, 40, 40, 200, 200);

  ctx.font = 'bold 58px Sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';

  const palabras = texto.split(' ');
  let linea = '', lineas = [];
  for (const palabra of palabras) {
    const test = linea + palabra + ' ';
    if (ctx.measureText(test).width > 900) {
      lineas.push(linea.trim());
      linea = palabra + ' ';
    } else {
      linea = test;
    }
  }
  if (linea) lineas.push(linea.trim());

  const inicioY = 400 - (lineas.length * 40);
  lineas.forEach((l, i) => ctx.fillText(l, 540, inicioY + (i * 80)));

  const logo = await loadImage('https://cdn.russellxz.click/a46036ec.png');
  ctx.drawImage(logo, canvas.width - 180, canvas.height - 180, 140, 140);

  const file = `./tmp/texto-${Date.now()}.png`;
  fs.writeFileSync(file, canvas.toBuffer());

  await conn.sendMessage(m.chat, { image: { url: file }, caption: '✅ Imagen generada' }, { quoted: m });
  fs.unlinkSync(file);
};

handler.command = ['texto'];
handler.tags = ['editor'];
handler.help = ['texto [color] texto'];
export default handler;
