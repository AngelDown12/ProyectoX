import * as e from "fs";

let handler = async (a, { conn: n, participants: r, usedPrefix, command }) => {
  // Foto de perfil del bot o imagen por defecto
  let s = await n.profilePictureUrl(a.sender, "image").catch((e) => "./Menu2.jpg");

  // Aseguramos que la ruta local de la imagen sea válida
  let imageBuffer;
  try {
    imageBuffer = e.readFileSync(s); // Intentamos leer la imagen
  } catch (error) {
    console.error("Error al leer la imagen:", error);
    // Si hay error al leer, asignamos una URL externa
    imageBuffer = await (await fetch("https://example.com/your-image.jpg")).buffer();
  }

  // Seleccionar aleatoriamente un participante para ejecutar el comando
  var p = [];
  r.map(async (e) => {
    p.push(e.id.replace("c.us", "s.whatsapp.net"));
  });

  let o = 3e4; // 30 segundos de espera (30000 ms)
  let m = p[Math.floor(Math.random() * p.length)];

  // Evitar que el bot sea seleccionado
  if (m.startsWith(n.user.id.split(":")[0])) return a.reply("Hoy no muere nadie :D");

  // Enviar mensaje con la razón de la ejecución y el aviso de inactividad
  await n.sendMessage(
    a.chat,
    {
      text: `*[ Basura Inactiva ]* 📓

┏━⊱ *Seleccionado:* @${m.split("@")[0]}
┗⊱ *Razón de su ejecución:* *Inactividad*

@${m.split("@")[0]} tienes *30 segundos* para despedirte de este grupo.

¡Buena suerte! 😎`,
      mentions: [m],
    },
    {
      ephemeralExpiration: 86400,
      quoted: {
        key: { participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" },
        message: {
          groupInviteMessage: {
            groupJid: "51995386439-1616169743@g.us",
            inviteCode: "m",
            groupName: "P",
            caption: `⚰️@${m.split("@")[0]} 💀`,
            jpegThumbnail: imageBuffer,
          },
        },
      },
    }
  );

  // Esperar 30 segundos antes de eliminar al usuario
  setTimeout(() => {
    setTimeout(() => {
      // Eliminar al usuario del grupo
      n.groupParticipantsUpdate(a.chat, [m], "remove").catch((e) => {
        a.reply("ERROR");
      });
    }, 1e3); // Elimina al usuario después de 1 segundo de retraso

    // Enviar mensaje de despedida
    n.sendMessage(
      a.chat,
      { text: "Adiós [F]", mentions: [m] },
      {
        ephemeralExpiration: 86400,
        quoted: {
          key: { participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" },
          message: {
            groupInviteMessage: {
              groupJid: "51995386439-1616169743@g.us",
              inviteCode: "m",
              groupName: "P",
              caption: `C come una manzana* :v🍎`,
              jpegThumbnail: imageBuffer, // Enviar imagen con el mensaje
            },
          },
        },
      }
    );
  }, o); // Se ejecuta luego de 30 segundos
};

(handler.help = ["basurainactiva"]),
  (handler.tags = ["games"]),
  (handler.command = /^(basurainactiva)$/i),
  (handler.group = !0),
  (handler.admin = !0),
  (handler.botAdmin = !0);

export default handler;
