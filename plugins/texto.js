import fetch from 'node-fetch';

const handler = async (m, { args, conn, usedPrefix, command }) => {
  let text = args.join(' ').trim();
  if (!text) {
    return m.reply(`✏️ Usa el comando así:\n\n*.${command} tu mensaje*\n\nEjemplo:\n*.${command} Hola grupo*`);
  }

  const res = await fetch(`https://api.lolhuman.xyz/api/photooxy1/text-under-flower?apikey=TuAPIKEY&text=${encodeURIComponent(text)}`);
  const json = await res.json();

  if (!json || !json.result) return m.reply('Ocurrió un error al generar la imagen.');

  await conn.sendMessage(m.chat, {
    image: { url: json.result },
    caption: `🖼 Generado por Azura Ultra & Cortana Bot`
  }, { quoted: m });
};

handler.command = ['texto'];
export default handler;
