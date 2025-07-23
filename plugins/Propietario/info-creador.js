const handler = async (m, { conn, usedPrefix }) => {
  // Información del creador (personalizable)
  const owner = {
    number: "5215565238431@s.whatsapp.net",
    name: "Kevv.",
    botName: "𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡",
    businessInfo: "Desarrollador de bots WhatsApp"
  };

  // Mensaje mejor estructurado
  const contactMessage = `
💬 *Puedes contactarme para:*
- Soporte técnico
- Consultas sobre el bot
- Desarrollo de bots personalizados
- Reporte de errores
- Precios a mi privado 

*Toca el contacto arriba para enviar un mensaje directo.*
`.trim();

  try {
    // Enviar contacto vCard (mejorado)
    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: owner.name,
        contacts: [{
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${owner.name}\nORG:${owner.botName};\nTEL;type=CELL;type=VOICE;waid=${owner.number.split('@')[0]}:+${owner.number.split('@')[0]}\nNOTE:${owner.businessInfo}\nEND:VCARD`
        }]
      }
    }, { quoted: m });

    // Enviar mensaje informativo (mejorado)
    await conn.sendMessage(m.chat, { 
      text: contactMessage,
      contextInfo: {
        mentionedJid: [owner.number]
      }
    }, { quoted: m });

  } catch (error) {
    console.error(chalk.red('Error al enviar contacto:'), error);
    await conn.sendMessage(m.chat, {
      text: '❌ Ocurrió un error al mostrar la información de contacto. Por favor intenta nuevamente.'
    }, { quoted: m });
  }
};

// Configuración del comando
handler.help = ['creador', 'owner', 'contacto'];
handler.tags = ['info'];
handler.command = /^(creador|owner|contacto|soporte|developer)$/i;

export default handler;
