import fetch from 'node-fetch';

const handler = async (m) => {
  try {
    const res = await fetch('https://api.vreden.my.id/api/topplayers');
    if (!res.ok) throw new Error('No se pudo obtener el ranking de jugadores');
    const json = await res.json();
    const players = json.result;

    let caption = "🏆 *Top Jugadores de Free Fire* 🏆\n\n";
    players.forEach((player, index) => {
      caption += `${index + 1}. ${player.nickname} - *Puntos:* ${player.points}\n`;
    });

    await conn.sendMessage(m.chat, { text: caption });
  } catch (e) {
    console.error(e);
    m.reply("❌ No se pudo obtener el ranking de jugadores. Intenta más tarde.");
  }
};

handler.command = /^(topplayers|ranking)$/i;
handler.help = ["topplayers", "ranking"];
handler.tags = ["juegos"];

export default handler;
