const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

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

let handler = async (m, { conn, args, text }) => {
  console.log('Comando .texto ejecutado');

  const chat = m.chat;
  const quoted = m.quoted;
  let contenido = text.trim();
  const primerPalabra = contenido.split(' ')[0]?.toLowerCase();
  const coloresGrad = colores[primerPalabra] || colores['azul'];

  if (colores[primerPalabra]) {
    contenido = contenido.split(' ').slice(1).join(' ');
  }

  if (!contenido && quoted?.text) {
    contenido = quoted.text;
  }

  if (!contenido) {
    return m.reply(`✏️ Usa el comando así:\n\n*.texto [color opcional] tu mensaje*\n\nColores disponibles:\n${Object.keys(colores).join(', ')}`);
  }

  const nombre = m.pushName || 'Usuario';
  let avatar = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';

  try {
    avatar = await conn.profilePictureUrl(m.sender, 'image');
  } catch {}

  await conn.sendMessage(chat, { react: { text: '🖼️', key: m.key } });

  const canvas = createCanvas(1080, 1080);
  const draw = canvas.getContext('2d');

  const grad = draw.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, coloresGrad[0]);
  grad.addColorStop(1, coloresGrad[1]);
  draw.fillStyle = grad;
  draw.fillRect(0, 0, 1080, 1080);

  const img = await loadImage(avatar);
  draw.save();
  draw.beginPath();
  draw.arc(100, 100, 80, 0, Math.PI * 2);
  draw.clip();
  draw.drawImage(img, 20, 20, 160, 160);
  draw.restore();

  draw.font = 'bold 40px Sans-serif';
  draw.fillStyle = '#ffffff';
  draw.fillText(nombre, 220, 100);

  draw.font = 'bold 60px Sans-serif';
  draw.fillStyle = '#ffffff';
  draw.textAlign = 'center';

  const palabras = contenido.split(' ');
  let linea = '', lineas = [];

  for (const palabra of palabras) {
    const prueba = linea + palabra + ' ';
    if (draw.measureText(prueba).width > 900) {
      lineas.push(linea.trim());
      linea = palabra + ' ';
    } else {
      linea = prueba;
    }
  }
  if (linea) lineas.push(linea.trim());

  const yInicial = 550 - (lineas.length * 35);
  lineas.forEach((l, i) => {
    draw.fillText(l, 540, yInicial + (i * 80));
  });

  const logo = await loadImage('https://cdn.russellxz.click/a46036ec.png');
  draw.drawImage(logo, 900, 900, 140, 140);

  const archivo = `./tmp/texto-${Date.now()}.png`;
  const stream = canvas.createPNGStream();
  const out = fs.createWriteStream(archivo);
  stream.pipe(out);

  out.on('finish', async () => {
    await conn.sendFile(chat, archivo, 'imagen.png', '🖼 Generado por GataBot', m);
    fs.unlinkSync(archivo);
  });
};

handler.command = /^texto$/i;
handler.help = ['texto [color] texto'];
handler.tags = ['editor'];

module.exports = handler;
