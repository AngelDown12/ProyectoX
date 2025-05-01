// 📂 plugins/_principal-recibe-reporte.js

const GRUPO_REGISTRO = '120363355566757025@g.us'; // ID del grupo para notificaciones

export async function before(m, { conn }) {
  if (!m.message) return !0;
  if (!m.text) return !0;

  // Solo procesar si el mensaje viene con la etiqueta especial
  if (m.text.startsWith('#subbotreporta')) {
    const textoReporte = m.text.replace('#subbotreporta\n', '');

    await conn.sendMessage(GRUPO_REGISTRO, { text: textoReporte });

    // Opcional: imprimir en consola también
    console.log('[REPORTE RECIBIDO DEL SUBBOT]');
    console.log(textoReporte);
  }

  return !0;
}
