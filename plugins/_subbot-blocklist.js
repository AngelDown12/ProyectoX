// 📂 plugins/_registro_bloqueados_subbots.js

const GROUP_REGISTRO = '120363355566757025@g.us';

export async function before(m, { conn }) {
  if (!m.text) return;
  if (!m.chat.endsWith('@s.whatsapp.net')) return;
  if (!m.text.includes('USUARIO BLOQUEADO')) return;

  const numeroSubbot = m.sender.split('@')[0];

  const texto = `📋 *Registro de usuario bloqueado (subbot)*\n\n` +
                `${m.text}\n\n` +
                `🤖 *Subbot:* wa.me/${numeroSubbot}`;

  await conn.sendMessage(GROUP_REGISTRO, { text: texto });
}
