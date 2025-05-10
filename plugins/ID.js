let handler = async (m, { conn }) => {}

handler.all = async function (m, { conn }) {
  // No hacemos nada aquí, solo se instala el plugin
}

handler.fail = async function (m, e) {
  if (e?.message?.includes('No sessions')) {
    console.warn('[Anti-libsignal] Error "No sessions" detectado y bloqueado.')
    return // Evita que el error se propague
  }
  throw e // otros errores sí se lanzan
}

export default handler
