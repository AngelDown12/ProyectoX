import * as e from "fs";

let handler = async (a, { conn: n, participants: r, usedPrefix, command }) => {
  // Foto de perfil del bot (si falla, una imagen épica de Free Fire)
  let s = await n.profilePictureUrl(a.sender, "image").catch((e) => "./Menu2.jpg");

  // Cargamos la imagen (si falla, una de respaldo)
  let imageBuffer;
  try {
    imageBuffer = e.readFileSync(s);
  } catch (error) {
    console.error("Error al leer la imagen:", error);
    imageBuffer = await (await fetch("https://i.imgur.com/3pZ9X7L.jpg")).buffer(); // Imagen de respaldo épica
  }

  // Seleccionar aleatoriamente a la víctima
  var p = [];
  r.map(async (e) => {
    p.push(e.id.replace("c.us", "s.whatsapp.net"));
  });

  let tiempoEspera = 3e4; // 30 segundos para suplicar
  let victima = p[Math.floor(Math.random() * p.length)];

  // Si el bot es seleccionado (nadie lo toca)
  if (victima.startsWith(n.user.id.split(":")[0])) return a.reply("⚠️ *Aquí manda el admin, no el bot, GG* 😏");

  // MENSAJE DE ELIMINACIÓN (Modo Tóxico ON)
  await n.sendMessage(
    a.chat,
    {
      text: `*¡ATENCIÓN!SE VA UN NOOB*☠️

┏━━⊱ *VÍCTIMA:* @${victima.split("@")[0]}
┣━━⊱ *Rango:* Hierro III 🗑️
┣━━⊱ *K/D:* 0.01 (Más bajo que tu autoestima) 📉
┣━━⊱ *Armas usadas:* NINGUNA (Corre y esconde) 🏃‍♂️💨
┗━━⊱ *Razón:* Jugador fantasma (¡Inactivo como tu papá!) 👻

@${victima.split("@")[0]} Tienes *30 segundos* para:
✅ *Suplicar por perdón*
✅ *Subir una foto de tu K/D real*
✅ *Aceptar que eres un NOOB*

*O...* te vas *BANEADO* como campero de zona segura. 🚫🔥

*¡Acepta tu destino, bot!* 🤖⚡`,
      mentions: [victima],
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
            caption: `⚡ @${victima.split("@")[0]} *¡PREPÁRATE PARA EL BAN!* 💣`,
            jpegThumbnail: imageBuffer,
          },
        },
      },
    }
  );

  // Esperar 30 segundos y BANEAR
  setTimeout(() => {
    setTimeout(() => {
      // Eliminar al usuario
      n.groupParticipantsUpdate(a.chat, [victima], "remove").catch((e) => {
        a.reply("*¡ERROR!* Seguro usaste hacks para evitar el ban. 🚫");
      });
    }, 1e3); // 1 segundo de delay épico

    // Mensaje de despedida (con burla incluida)
    n.sendMessage(
      a.chat,
      { text: `*@${victima.split("@")[0]}* ¡Fuiste *ELIMINADO* como un *NOOB* en zona abierta! [F] 🪦\n*K/D actualizado: -∞* 📉`, mentions: [victima] },
      {
        ephemeralExpiration: 86400,
        quoted: {
          key: { participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" },
          message: {
            groupInviteMessage: {
              groupJid: "51995386439-1616169743@g.us",
              inviteCode: "m",
              groupName: "P",
              caption: `*Se fue como las skins gratis...* 🎁💨\n*¡Nadie lo extrañará!* 😂`,
              jpegThumbnail: imageBuffer,
            },
          },
        },
      }
    );
  }, tiempoEspera); // Fin del tiempo
};

// Configuración del comando
handler.help = ["eliminartoxico"];
handler.tags = ["games"];
handler.command = /^(eliminartoxico|fftoxic|banvsfriki)$/i; // Nuevos comandos
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
