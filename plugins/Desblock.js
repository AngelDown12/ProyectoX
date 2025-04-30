// Archivo: plugins/desblock-todos.js
import { WAMessageStubType } from '@whiskeysockets/baileys';

const comando = /^\.desblock$/i;

export async function before(m, { conn, isOwner, isROwner }) {
  // Solo permitir al dueño o root
  if (!isOwner && !isROwner) return;
}

export const command = comando;

export async function handler(m, { conn }) {
  const bloqueados = await conn.fetchBlocklist(); // Obtener lista de bloqueados

  if (!bloqueados || bloqueados.length === 0) {
    return m.reply('No hay usuarios bloqueados actualmente.');
  }

  for (const jid of bloqueados) {
    await conn.updateBlockStatus(jid, 'unblock');
  }

  m.reply(`Se han desbloqueado ${bloqueados.length} usuarios correctamente.`);
}

handler.help = ['desblock'];
handler.tags = ['owner'];
handler.command = comando;
handler.rowner = true; // Solo root
