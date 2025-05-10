let handler = async (m, { conn }) => {}

handler.fail = async function (m, e) {
  if (e?.message?.includes('No sessions')) {
    console.warn('[Protección Signal] Se detectó un error de sesión Signal (libsignal). Ignorado.')
    return
  }
  throw e
}

export default handler
