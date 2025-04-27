import fetch from 'node-fetch';

const handler = async (m) => {
  try {
    // Intentamos obtener la información del jugador de una nueva API de Free Fire (puedes actualizarla si tienes una nueva fuente).
    const res = await fetch('https://api.freemaster.com/freefire/playerStats?player_id=exampleID');
    if (!res.ok) throw new Error('No se pudo obtener los datos del jugador');

    // Parseamos los datos de la API
    const json = await res.json();

    // Verificamos si la respuesta tiene los datos esperados
    if (!json.data || !json.data.stats) {
      throw new Error('No se encontró la información del jugador');
    }

    const playerData = json.data;

    // Creamos un mensaje con los detalles del jugador
    const caption = `
      🎮 *Estadísticas de Jugador de Free Fire* 🎮
      
      *Nombre:* ${playerData.name}
      *Rango:* ${playerData.rank}
      *Victorias:* ${playerData.victories}
      *Kills:* ${playerData.kills}
      *Puntos:* ${playerData.points}
      *Nivel:* ${playerData.level}
    `;

    // Enviamos el mensaje con los datos del jugador
    await conn.sendMessage(m.chat, { text: caption });
  } catch (e) {
    console.error(e);
    m.reply("❌ No se pudo obtener la información del jugador. Intenta más tarde.");
  }
};

handler.command = /^(estadisticasff|infojugador)$/i;
handler.help = ["estadisticasff", "infojugador"];
handler.tags = ["juegos"];

export default handler;
