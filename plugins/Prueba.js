const handler = async (m, { conn, text }) => {
  try {
    await conn.sendMessage(m.chat, { text: '✅ *El bot puede responder en este grupo.*' }, { quoted: m })
  } catch (e) {
    console.error('❌ Error al enviar mensaje:', e)
    await conn.reply(m.chat, '❌ *El bot NO puede enviar mensajes en este grupo.*\n\n📄 Error:\n' + e, m)
  }
}

handler.help = ['pruebaenvio']
handler.tags = ['info']
handler.command = /^pruebaenvio$/i

export default handler
