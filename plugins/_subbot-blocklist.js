// 📂 plugins/_registro-bloqueados-subbots.js

const GROUP_REGISTRO = '120363355566757025@g.us'; // Grupo donde se registrarán los bloqueados

// Aquí manejamos el registro de los bloqueados de los subbots
export async function before(m, { conn }) {
  if (!m.text) return; // Solo si tiene texto
  if (!m.chat.endsWith('@s.whatsapp.net')) return; // Solo mensajes privados del subbot

  // Comprobar si el mensaje contiene la información de un bloqueado
  if (m.text.includes('USUARIO BLOQUEADO')) {
    const numeroSubbot = m.sender.split('@')[0]; // Extraemos el número del subbot

    // Formato del mensaje que se enviará al grupo
    const mensaje = `*🚫 Usuario Bloqueado (Subbot)*\n` +
                    `*Subbot:* wa.me/${numeroSubbot}\n` +
                    `*Mensaje bloqueado:* ${m.text}`;

    // Enviar mensaje al grupo de registro
    await conn.sendMessage(GROUP_REGISTRO, { text: mensaje });
  }
}
