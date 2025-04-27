import * as e from "fs";

let handler = async (a, { conn: n, participants: r, usedPrefix, command }) => {
  let s = await n.profilePictureUrl(a.sender, "image").catch((e) => "./Menu2.jpg");
  var p = [];
  r.map(async (e) => {
    p.push(e.id.replace("c.us", "s.whatsapp.net"));
  });

  let o = 3e4; // 30 segundos (30,000 milisegundos)
  let m = p[Math.floor(Math.random() * p.length)];

  if (m.startsWith(n.user.id.split(":")[0])) return a.reply("Hoy no muere nadie :D");

  // Enviar mensaje avisando de la despedida
  n.sendMessage(
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
            jpegThumbnail: s,
          },
        },
      },
    }
  );

  // Espera 30 segundos antes de eliminar al usuario
  setTimeout(() => {
    setTimeout(() => {
      n.groupParticipantsUpdate(a.chat, [m], "remove").catch((e) => {
        a.reply("ERROR");
      });
    }, 1e3); // Elimina al usuario después de 1 segundo de retraso.

    // Enviar un mensaje de despedida
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
              jpegThumbnail: e.readFileSync("./Menu2.jpg"),
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
