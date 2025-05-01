// 📂 plugins/_registro-bloqueados-subbots.js

// Este plugin será solo para el bot principal
export async function before(m, { conn }) {
  if (!m.text) return; // Solo si el mensaje tiene texto
  if (m.isGroup) return; // Solo si no es un mensaje en grupo
  if (!m.chat.endsWith('@s.whatsapp.net')) return; // Solo si es un mensaje privado

  // Comprobamos que el mensaje es un reporte de un bloqueado
  if (m.text.includes('USUARIO BLOQUEADO')) {
    const numeroSubbot = m.sender.split('@')[0]; // Extraemos el número del subbot

    // Preparamos el mensaje con la información del bloqueo
    const mensaje = `*🚫 Usuario Bloqueado (Subbot)*\n` +
                    `*Subbot:* wa.me/${numeroSubbot}\n` +
                    `*Mensaje bloqueado:* ${m.text}`;

    // Solo imprimimos el mensaje en la consola (sin enviar al privado ni al grupo)
    console.log(`*REPORTE DE BLOQUEO (Subbot):*\n${mensaje}`);

    // No enviamos nada a ningún grupo ni al privado del bot.
  }
}
