const handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw 'Este comando solo lo puede usar el dueño del bot.';

  const bloqueados = (await conn.fetchBlocklist() || []).filter(jid =>
    jid.endsWith('@s.whatsapp.net') && /^\d{5,}@s\.whatsapp\.net$/.test(jid)
  );

  if (!bloqueados.length) {
    return m.reply('No hay usuarios bloqueados actualmente.');
  }

  let desbloqueados = 0;
  let errores = [];

  for (const jid of bloqueados) {
    try {
      await conn.updateBlockStatus(jid, 'unblock');
      desbloqueados++;
    } catch (e) {
      errores.push(`- Error con ${jid}: ${e?.output?.error || e.message || e}`);
    }
  }

  const textoFinal = [
    '✅ *Proceso terminado.*',
    '',
    `Total desbloqueados: ${desbloqueados}`,
    `Aún bloqueados: ${bloqueados.length - desbloqueados}`,
    errores.length ? '\nErrores:\n' + errores.join('\n') : ''
  ].join('\n');

  m.reply(textoFinal);
};

handler.command = /^desblock$/i;
handler.rowner = true;

export default handler;
