let handler = async (m, { conn, command }) => {
  let isClose = {
    'abrirgrupo': 'not_announcement',
    'grupoabrir': 'not_announcement',
    'abrir grupo': 'not_announcement',
    'grupo abrir': 'not_announcement',
    'cerrargrupo': 'announcement',
    'grupocerrar': 'announcement',
    'cerrar grupo': 'announcement',
    'grupo cerrar': 'announcement'
  }[command.toLowerCase()];

  if (!isClose) return;

  await conn.groupSettingUpdate(m.chat, isClose);

  // Omitimos cualquier respuesta si quieres que no diga nada.
};

handler.command = [
  /^abrirgrupo$/, /^grupoabrir$/, /^abrir grupo$/, /^grupo abrir$/,
  /^cerrargrupo$/, /^grupocerrar$/, /^cerrar grupo$/, /^grupo cerrar$/
];
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
