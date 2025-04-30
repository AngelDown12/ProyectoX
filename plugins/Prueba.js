const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const handler = async (msg, { conn }) => {
  try {
    const chatId = msg.key.remoteJid;
    const user = msg.sender;

    let avatar = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
    try {
      avatar = await conn.profilePictureUrl(user, 'image');
    } catch {}

    const baseImage = await loadImage(avatar);
    const overlay = await loadImage('https://files.catbox.moe/jtx5it.jpg');

    const canvas = createCanvas(720, 720);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(baseImage, 0, 0, 720, 720);
    ctx.drawImage(overlay, 0, 0, 720, 720);

    const fileName = `./tmp/gay-${Date.now()}.jpg`;
    const out = fs.createWriteStream(fileName);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    out.on('finish', async () => {
      await conn.sendMessage(chatId, {
        image: { url: fileName },
        caption: 'Gay mode activado!',
      }, { quoted: msg });
      fs.unlinkSync(fileName);
    });

  } catch (e) {
    console.error('Error en comando .gay:', e);
    await conn.sendMessage(msg.key.remoteJid, { text: '❌ Error al generar la imagen.' }, { quoted: msg });
  }
};

handler.command = ['gay3'];
module.exports = handler;
