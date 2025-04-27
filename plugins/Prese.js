import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return; // Evento: Creación de grupo

  let subject = groupMetadata.subject || "el grupo";
  let botName = conn.user.name; // Nombre del bot
  let imageUrl = 'https://qu.ax/nxskN.jpg'; // Enlace de la imagen

  let welcomeBot = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢!🥇

  ¡Soy ${botName}, su nuevo asistente digital!
  
  ━━━━━━━━━━━━━━━━━━━
  ⚡ *Mis funciones :*
  ▸ Descargar música/videos
  ▸ Búsquedas en Google
  ▸ Juegos y diversión
  ▸ Generar imágenes con IA
  ▸ Herramientas para Free Fire
  ━━━━━━━━━━━━━━━━━━━
  📂 *Mis menús:*
  ▸ .menu → *Menú general*
  ▸ .menuimg → *Imágenes AI*
  ▸ .menuhot → *Contenido hot*
  ▸ .menuaudios → *Efectos*
  ▸ .menujuegos → *Juegos grupal*
  ▸ .menufreefire → *Free Fire tools*
  ━━━━━━━━━━━━━━━━━━━
  ©EliteBotGlobal 2023`;

  // Configuración de botones
  const buttons = [
    {
      buttonId: 'menu_general',
      buttonText: { displayText: '📜 Menú General' },
      type: 1,
    },
    {
      buttonId: 'menu_img',
      buttonText: { displayText: '🖼️ Imágenes AI' },
      type: 1,
    },
    {
      buttonId: 'menu_freefire',
      buttonText: { displayText: '🔥 Free Fire Tools' },
      type: 1,
    }
  ];

  // Generar mensaje interactivo
  const mensaje = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: welcomeBot },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, {});

  // Enviar mensaje
  await conn.relayMessage(m.chat, mensaje.message, { messageId: mensaje.key.id });
};

export async function after(m, { conn }) {
  try {
    const button = m?.message?.buttonsResponseMessage;
    if (!button) return;

    const id = button.selectedButtonId;

    // Responder según el botón seleccionado
    switch (id) {
      case 'menu_general':
        await conn.sendMessage(m.chat, { text: '📜 Aquí tienes el menú general:\n.1 - Información\n.2 - Ayuda' });
        break;
      case 'menu_img':
        await conn.sendMessage(m.chat, { text: '🖼️ Aquí tienes el menú de imágenes AI:\nPrueba el comando `.menuimg`' });
        break;
      case 'menu_freefire':
        await conn.sendMessage(m.chat, { text: '🔥 Herramientas para Free Fire:\nUsa el comando `.menufreefire`' });
        break;
      default:
        await conn.sendMessage(m.chat, { text: '❌ Opción no reconocida. Intenta de nuevo.' });
    }
  } catch (error) {
    console.error('Error en after:', error);
    await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
  }
}

handler.customPrefix = /^(menu_general|menu_img|menu_freefire)$/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
