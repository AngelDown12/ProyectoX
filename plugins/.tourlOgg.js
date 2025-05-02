import { promises as fs, existsSync } from 'fs'
import path from 'path'

const handler = async (m, { conn }) => {
  if (!m.fromMe && !global.isCreator) throw 'Solo el Owner puede ejecutar esto.';

  const sessionPath = './GataBotSession/';
  let filesDeleted = 0;
  try {
    // Limpieza de archivos de sesión (excepto creds.json)
    if (existsSync(sessionPath)) {
      const files = await fs.readdir(sessionPath);
      for (const file of files) {
        if (file !== 'creds.json') {
          await fs.unlink(path.join(sessionPath, file));
          filesDeleted++;
        }
      }
    }

    // Limpieza de claves internas de Baileys (SignalProtocol)
    await conn.authState.keys.set('session', {})

    await conn.sendMessage(m.chat, {
      text: `✅ Limpieza completada.\n\n» Archivos de sesión eliminados: *${filesDeleted}*\n» Claves internas de cifrado reiniciadas.`,
    }, { quoted: m });

  } catch (err) {
    console.error('Error durante la limpieza de sesión:', err);
    await conn.sendMessage(m.chat, {
      text: `⚠️ Ocurrió un error durante la limpieza:\n${err.message}`,
    }, { quoted: m });
  }
};

handler.help = ['resetsession'];
handler.tags = ['owner'];
handler.command = /^(resetsession|limpiezatotal)$/i;


export default handler;
