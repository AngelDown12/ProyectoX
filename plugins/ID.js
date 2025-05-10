import fs from 'fs';

var handler = async (m, { conn }) => {
  // Obtener metadata del grupo
  let groupMetadata;
  try {
    groupMetadata = await conn.groupMetadata(m.chat);
  } catch (e) {
    return conn.reply(m.chat, 'Error obteniendo la información del grupo.', m);
  }

  const idGrupo = groupMetadata.id;
  const nombreGrupo = groupMetadata.subject;
  const fechaRegistro = new Date().toISOString();
  const rutaArchivo = './cred.json';

  // Cargar archivo cred.json o inicializar si no existe
  let datos = { grupos: {} };
  try {
    if (fs.existsSync(rutaArchivo)) {
      datos = JSON.parse(fs.readFileSync(rutaArchivo));
    }
  } catch (err) {
    console.error('Error leyendo cred.json:', err);
    return conn.reply(m.chat, 'Error leyendo cred.json.', m);
  }

  // Registrar el grupo (siempre se actualiza o agrega)
  datos.grupos[idGrupo] = {
    nombre: nombreGrupo,
    fecha: fechaRegistro
  };

  // Guardar cambios en cred.json
  try {
    fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2));
  } catch (err) {
    console.error('Error escribiendo cred.json:', err);
    return conn.reply(m.chat, 'Error guardando el grupo en la base de datos.', m);
  }

  // Respuesta sin errores de libsignal
  conn.reply(
    m.chat,
    `𝗘𝗹𝗶𝘁𝗲𝗕𝗼𝘁𝗚𝗹𝗼𝗯𝗮𝗹\n\n𝗘𝗹 𝗜𝗗 𝗱𝗲 𝗲𝘀𝘁𝗲 𝗴𝗿𝘂𝗽𝗼 𝗲𝘀:\n${idGrupo}\n\nGrupo registrado correctamente en *cred.json*.`,
    m
  );
};

handler.help = ['idgrupo'];
handler.tags = ['grupo'];
handler.command = /^(idd|idgrupo|id)$/i;
handler.group = true;

export default handler;
