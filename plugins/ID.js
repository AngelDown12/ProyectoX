var handler = async (m, { conn, groupMetadata }) => {
  // Asegura que groupMetadata esté cargado
  if (!groupMetadata) groupMetadata = await conn.groupMetadata(m.chat);

  // Obtenemos el ID del grupo
  const idGrupo = groupMetadata.id;

  // Base de datos: registrar grupo si no existe
  if (!global.db.data.chats) global.db.data.chats = {};
  if (!global.db.data.chats[idGrupo]) {
    global.db.data.chats[idGrupo] = {
      registered: true,
      nombre: groupMetadata.subject,
      fecha: new Date().toISOString()
    };
  }

  // Enviar respuesta
  conn.reply(
    m.chat,
    `𝗘𝗹𝗶𝘁𝗲𝗕𝗼𝘁𝗚𝗹𝗼𝗯𝗮𝗹\n\n𝗘𝗹 𝗜𝗗 𝗱𝗲 𝗲𝘀𝘁𝗲 𝗴𝗿𝘂𝗽𝗼 𝗲𝘀:\n${idGrupo}\n\nGrupo registrado correctamente en la base de datos.`,
    m
  );
};

handler.help = ['idgrupo'];
handler.tags = ['grupo'];
handler.command = /^(id|idgrupo|id)$/i;
handler.group = true;

export default handler;
