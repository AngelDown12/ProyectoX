// archivo: plugins/diagnostico-grupo.js

export async function commandDiagnosticoGrupo(m, { conn, args }) {
  try {
    // Verifica que sea un grupo
    if (!m.isGroup) return m.reply('Este comando solo se puede usar en grupos.')

    let chatSettings = global.db.data.chats[m.chat] || {}

    // Comprobaciones básicas
    let respuesta = `*[ DIAGNÓSTICO DEL GRUPO ]*\n\n`
    respuesta += `ID del Grupo: ${m.chat}\n`
    respuesta += `Nombre: ${await conn.groupMetadata(m.chat).then(res => res.subject).catch(() => 'Desconocido')}\n\n`

    respuesta += `*Estado General:*\n`

    // ¿El grupo está baneado?
    if (chatSettings.isBanned) {
      respuesta += `- Este grupo está *BANEADO*.\n`
    } else {
      respuesta += `- Este grupo *NO está baneado*.\n`
    }

    // ¿El bot es Admin?
    const groupMetadata = await conn.groupMetadata(m.chat)
    const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const participants = groupMetadata.participants || []
    const botParticipant = participants.find(p => p.id === botNumber)

    if (botParticipant?.admin) {
      respuesta += `- El bot *ES ADMIN* en este grupo.\n`
    } else {
      respuesta += `- El bot *NO ES ADMIN* en este grupo.\n`
    }

    // ¿Puede enviar mensajes?
    if (groupMetadata?.restrict) {
      respuesta += `- El grupo tiene restricciones de envío (*modo solo admins*).\n`
    } else {
      respuesta += `- El grupo permite mensajes a *todos* los miembros.\n`
    }

    // Test rápido: intentar enviar un mensaje de prueba
    try {
      await conn.sendMessage(m.chat, { text: '✅ Test de envío exitoso.' }, { quoted: m })
      respuesta += `\n- *Mensaje de prueba enviado correctamente.*\n`
    } catch (errorEnvio) {
      respuesta += `\n- *Error al enviar mensaje de prueba:* ${errorEnvio.message}\n`
    }

    await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m })

  } catch (err) {
    console.error('[DIAGNOSTICO-GRUPO ERROR]', err)
    await m.reply('❌ Error al realizar el diagnóstico: ' + err.message)
  }
}

// Registrarlo como comando
commandDiagnosticoGrupo.command = /^diagnosticogrupo$/i
commandDiagnosticoGrupo.group = true
export default commandDiagnosticoGrupo
