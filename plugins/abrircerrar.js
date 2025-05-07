let handler = async (m, { conn, args, usedPrefix, command }) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg';  
  let isClose = { 
    'abrir grupo': 'not_announcement',
    'grupo abrir': 'not_announcement',
    'abrirgrupo': 'not_announcement',
    'grupoabrir': 'not_announcement',
    'cerrar grupo': 'announcement',
    'grupo cerrar': 'announcement',
    'cerrargrupo': 'announcement',
    'grupocerrar': 'announcement',
  }[(args[0] || '')];

  if (isClose === undefined)
    throw `
${lenguajeGB['smsAvisoMG']()}
*┃➥ ${usedPrefix + command} abrir grupo*
*┃➥ ${usedPrefix + command} cerrar grupo*
`.trim();

  await conn.groupSettingUpdate(m.chat, isClose);
  
  if (isClose === 'not_announcement') {
    conn.sendButton(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙔𝘼 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝘿𝙊 𝙏𝙊𝘿𝙊𝙎 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊!!`, `𝙂𝙍𝙐𝙋𝙊 𝘼𝘽𝙄𝙀𝙍𝙏𝙊\n${wm}`, pp, [['𝘾𝙪𝙚𝙣𝙩𝙖𝙨 𝙊𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 | 𝘼𝙘𝙘𝙤𝙪𝙣𝙩𝙨 ✅', '.cuentasgb'], ['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', `/menu`]], m);
  }

  if (isClose === 'announcement') {
    conn.sendButton(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙎𝙊𝙇𝙊 𝙇𝙊𝙎 𝘼𝘿𝙈𝙄𝙉𝙎 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊!!`, `𝙂𝙍𝙐𝙋𝙊 𝘾𝙀𝙍𝙍𝘼𝘿𝙊\n${wm}`, pp, [['𝙈𝙤𝙢𝙚𝙣𝙩𝙤 𝘼𝙙𝙢𝙞𝙣 😎', '.s'], ['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', `/menu`]], m);
  }
};

handler.help = ['grupo abrir', 'grupo cerrar', 'abrir grupo', 'cerrar grupo', 'abrirgrupo', 'cerrargrupo', 'grupoabrir', 'grupocerrar'];
handler.tags = ['grupo'];
handler.command = /^(abrir grupo|grupo abrir|abrirgrupo|grupoabrir|cerrar grupo|grupo cerrar|cerrargrupo|grupocerrar)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.exp = 200;

export default handler;
