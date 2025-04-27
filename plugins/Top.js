import fetch from 'node-fetch';

const handler = async (m) => {
  try {
    // Intentamos obtener la lista de los mejores jugadores
    const res = await fetch('https://api.vreden.my.id/api/topplayers');
    if (!res.ok) throw new Error('No se pudo obtener el ranking de jugadores');
    
    // Parseamos los datos de la API
    const json = await res.json();

    // Verificamos si la respuesta tiene los datos esperados
    if (!json.result || !Array.isArray(json.result)) {
      throw new Error('No se encontró la lista de jugadores');
    }

    const players = json.result;

    // Creamos un mensaje con el top de jugadores
    let caption = "🏆 *Top Jugadores de Free Fire* 🏆\n\n";
    players.forEach((player, index) => {
      caption += `${index + 1}. ${player.nickname} - *Puntos:* ${player.points}\n`;
    });

    // Enviamos el mensaje con la lista de jugadores
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
