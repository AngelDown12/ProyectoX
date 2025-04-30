import fs from 'fs';

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('Solo el dueño puede usar este comando.');

  try {
    const bloqueados = await conn.fetchBlocklist() || [];

    if (!bloqueados.length) {
      return m.reply('No tienes usuarios bloqueados actualmente.');
    }

    let desbloqueados = 0;
    let errores = [];

    for (let jid of bloqueados) {
      if (!jid.endsWith('@s.whatsapp.net')) {
        errores.push(`Formato inválido: ${jid}`);
        continue;
      }

      try {
        await conn.updateBlockStatus(jid, 'unblock');
        console.log(`Desbloqueado correctamente: ${jid}`);
        desbloqueados++;
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        const errorMsg = `Error con ${jid}: ${e.message || e}`;
        errores.push(errorMsg);
        console.error(errorMsg);
      }
    }

    const bloqueadosFinal = await conn.fetchBlocklist();

    let respuesta = `✅ Proceso terminado.\n\nTotal desbloqueados: ${desbloqueados}\nAún bloqueados: ${bloqueadosFinal.length}`;
    if (errores.length) {
      respuesta += `\n\nErrores:\n- ` + errores.join('\n- ');
    }

    m.reply(respuesta);
  } catch (e) {
    console.error('Error global en el comando .desblock:', e);
    m.reply('Ocurrió un error general en el desbloqueo.');
  }
};

handler.command = /^\.?desblock$/i;
handler.owner = true;

export default handler;
