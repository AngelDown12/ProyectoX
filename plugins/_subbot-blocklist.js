// 📂 plugins/_registro-bloqueados-subbots.js

// Este plugin será solo para el bot principal
export async function before(m, { conn }) {
  if (!m.text) return; // Solo si el mensaje tiene texto
  if (!m.chat.endsWith('@s.whatsapp.net')) return; // Solo si es un mensaje privado del subbot

  // Comprobamos que el mensaje es un reporte de un bloqueado
  if (m.text.includes('USUARIO BLOQUEADO')) {
    const numeroSubbot = m.sender.split('@')[0]; // Extraemos el número del subbot

    // Preparamos el mensaje con la información del bloqueo
    const mensaje = `*🚫 Usuario Bloqueado (Subbot)*\n` +
                    `*Subbot:* wa.me/${numeroSubbot}\n` +
                    `*Mensaje bloqueado:* ${m.text}`;

    // Imprimimos el mensaje en la consola (sin enviarlo a ningún lado)
    console.log(`*REPORTE DE BLOQUEO (Subbot):*\n${mensaje}`);

    // En este caso, no estamos enviando nada al privado ni al grupo.
    // El mensaje solo se muestra en la consola para que el administrador lo copie manualmente.
  }
}
