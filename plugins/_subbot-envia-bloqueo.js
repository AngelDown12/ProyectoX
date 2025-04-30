// 📂 plugins/_registro_bloqueados_subbots.js

const GROUP_REGISTRO = '120363355566757025@g.us'; // Grupo de registro

export async function before(m, { conn }) {
  if (!m.text) return; // Solo mensajes con texto
  if (!m.chat.endsWith('@s.whatsapp.net')) return; // Solo privados

  // Validar que el mensaje venga de un subbot y tenga formato esperado
  const esReporteBloqueo = m.text.includes('USUARIO BLOQUEADO') || m.text.includes('[SUBBOT-BLOCK]');
  if (!esReporteBloqueo) return;

  const numeroSubbot = m.sender.split('@')[0];
  const mensaje = m.text;

  const texto = `📋 *Registro de usuario bloqueado (subbot)*\n\n` +
                `${mensaje}\n\n` +
                `🤖 *Subbot:* wa.me/${numeroSubbot}`;

  await conn.sendMessage(GROUP_REGISTRO, { text: texto });
}
