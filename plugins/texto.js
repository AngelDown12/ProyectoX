import fetch from 'node-fetch';

const handler = async (m, { args, conn, usedPrefix, command }) => {
  let text = args.join(' ').trim();
  if (!text) {
    return m.reply(`✏️ Usa el comando así:\n\n*.${command} tu mensaje*\n\nEjemplo:\n*.${command} Hola grupo*`);
  }

  const url = `https://api.lolhuman.xyz/api/photooxy1/text-under-flower?apikey=BrunoSobrino&text=${encodeURIComponent(text)}`;
  
  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.result) throw 'No se pudo generar la imagen.';

    await conn.sendMessage(m.chat, {
      image: { url: json.result },
      caption: `🖼 Generado por Azura Ultra & Cortana Bot`
    }, { quoted: m });
  } catch (err) {
    m.reply('Error al generar la imagen. Intenta más tarde.');
  }
};

handler.command = ['texto'];
export default handler;
