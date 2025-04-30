import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

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

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ').trim();
  if (!text) {
    return m.reply(`✏️ Usa el comando así:\n\n*.${command} [color opcional] tu mensaje*\n\nEjemplo:\n*.${command} azul Hola grupo*\n\nColores disponibles:\nazul, rojo, verde, rosa, morado, negro, naranja, gris, celeste`);
  }

  const [colorElegido, ...contenidoArr] = text.split(' ');
  const coloresGrad = colores[colorElegido.toLowerCase()] || colores['azul'];
  const contenido = colores[colorElegido.toLowerCase()] ? contenidoArr.join(' ') : text;

  const displayName = m.pushName || 'Usuario';
  let avatarUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
  try {
    avatarUrl = await conn.profilePictureUrl(m.sender, 'image');
  } catch {}

  const canvas = createCanvas(1080, 1080);
  const draw = canvas.getContext('2d');

  const grad = draw.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, coloresGrad[0]);
  grad.addColorStop(1, coloresGrad[1]);
  draw.fillStyle = grad;
  draw.fillRect(0, 0, 1080, 1080);

  // Avatar circular
  const avatar = await loadImage(avatarUrl);
  draw.save();
  draw.beginPath();
  draw.arc(100, 100, 80, 0, Math.PI * 2);
  draw.clip();
  draw.drawImage(avatar, 20, 20, 160, 160);
  draw.restore();

  // Nombre
  draw.font = 'bold 40px Sans-serif';
  draw.fillStyle = '#ffffff';
  draw.fillText(displayName, 220, 100);

  // Texto central
  draw.font = 'bold 60px Sans-serif';
  draw.fillStyle = '#ffffff';
  draw.textAlign = 'center';

  const words = contenido.split(' ');
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
  lines.forEach((l, i) => {
    draw.fillText(l, 540, startY + (i * 80));
  });

  // Logo
  const logo = await loadImage('https://cdn.russellxz.click/a46036ec.png');
  draw.drawImage(logo, canvas.width - 180, canvas.height - 180, 140, 140);

  // Guardar y enviar
  const filePath = `./tmp/texto-${Date.now()}.png`;
  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', async () => {
    await conn.sendMessage(m.chat, {
      image: { url: filePath },
      caption: `🖼 Generado por Azura Ultra & Cortana Bot`
    }, { quoted: m });
    fs.unlinkSync(filePath);
  });
};

handler.command = ['texto'];
export default handler;
