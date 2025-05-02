import { promises as fs, existsSync } from 'fs'
import path from 'path'

const handler = async (m, { conn }) => {
  const ownerNumber = '593993370003@s.whatsapp.net'; // ← Cambia esto por tu número con @s.whatsapp.net

  if (m.sender !== ownerNumber) {
    return await conn.sendMessage(m.chat, {
      text: 'Solo el Owner autorizado puede ejecutar este comando.',
    }, { quoted: m });
  }

  const sessionPath = './GataBotSession/';
  let filesDeleted = 0;

  try {
    // Borra archivos de sesión excepto creds.json
    if (existsSync(sessionPath)) {
      const files = await fs.readdir(sessionPath);
      for (const file of files) {
        if (file !== 'creds.json') {
          await fs.unlink(path.join(sessionPath, file));
          filesDeleted++;
        }
      }
    }

    // Limpia sesiones internas (SignalProtocol)
    await conn.authState.keys.set('session', {})

    await conn.sendMessage(m.chat, {
      text: `✅ Limpieza completada.\n\n» Archivos eliminados: *${filesDeleted}*\n» Claves internas reiniciadas.`,
    }, { quoted: m });

  } catch (err) {
    console.error('Error durante la limpieza de sesión:', err);
    await conn.sendMessage(m.chat, {
      text: `⚠️ Error durante la limpieza:\n${err.message}`,
    }, { quoted: m });
  }
};

handler.help = ['resetsession'];
handler.tags = ['owner'];
handler.command = /^(resetsession|limpiezatotal)$/i;
export default handler;
