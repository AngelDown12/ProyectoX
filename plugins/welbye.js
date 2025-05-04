import { downloadProfilePicture } from '../lib/functions.js';

export async function handler(event, conn) {
  const { id, participants, action } = event;

  for (let user of participants) {
    let pp = 'src/sinfoto.jpg'; // Ruta por defecto si no hay foto
    try {
      pp = await downloadProfilePicture(user, 'image');
    } catch (e) {
      // Si falla, se mantiene la imagen por defecto
    }

    let groupMetadata = await conn.groupMetadata(id);
    let groupName = groupMetadata.subject;
    let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Caracas' });
    let tagUser = '@' + user.split('@')[0];

    let message = '';
    if (action === 'add') {
      message = `*Bienvenido(a) ${tagUser} al grupo ${groupName}*\n\n_¡Esperamos que disfrutes tu estadía!_\nFecha: ${date}`;
    } else if (action === 'remove') {
      message = `*${tagUser} ha salido del grupo ${groupName}*\n\n_¡Buena suerte en tus próximos caminos!_\nFecha: ${date}`;
    } else {
      continue;
    }

    await conn.sendMessage(id, {
      image: { url: pp },
      caption: message,
      mentions: [user]
    });
  }
}

export const options = {
  event: ['group-participants.update']
};
