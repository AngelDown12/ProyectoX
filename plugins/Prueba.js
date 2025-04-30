import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, usedPrefix, command }) => {
  const carpeta = path.join(__dirname, '../media/sinfoto3');
  let archivos = fs.readdirSync(carpeta);
  let elegido = archivos[Math.floor(Math.random() * archivos.length)];
  let ruta = path.join(carpeta, elegido);

  // Envía la imagen con texto
  await conn.sendFile(
    m.chat,
    ruta,
    elegido,
    '*Orgullosamente gay*',
    m
  );
};

handler.command = /^gay3$/i;
handler.tags = ['fun'];
handler.help = ['gay3'];

export default handler;
