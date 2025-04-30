let handler = async (m, {conn, text, participants}) => {
  try {
    let users = participants.map((u) => conn.decodeJid(u.id));
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    let isMedia = /image|video|sticker|audio/.test(mime);
    let more = String.fromCharCode(8206);
    let masss = more.repeat(850);
    let htextos = `${text ? text : "*Hola :D*"}`;

    if (isMedia && quoted.mtype === "imageMessage") {
      var mediax = await quoted.download?.();
      await conn.sendMessage(
        m.chat,
        {
          image: mediax,
          caption: htextos,
          mentions: users
        },
        { quoted: m }
      );
    } else if (isMedia && quoted.mtype === "videoMessage") {
      var mediax = await quoted.download?.();
      await conn.sendMessage(
        m.chat,
        {
          video: mediax,
          mimetype: "video/mp4",
          caption: htextos,
          mentions: users
        },
        { quoted: m }
      );
    } else if (isMedia && quoted.mtype === "audioMessage") {
      var mediax = await quoted.download?.();
      await conn.sendMessage(
        m.chat,
        {
          audio: mediax,
          mimetype: "audio/mp4",
          fileName: "Hidetag.mp3",
          mentions: users
        },
        { quoted: m }
      );
    } else if (isMedia && quoted.mtype === "stickerMessage") {
      var mediax = await quoted.download?.();
      await conn.sendMessage(
        m.chat,
        {
          sticker: mediax,
          mentions: users
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        {
          text: `${masss}\n${htextos}`,
          mentions: users
        },
        { quoted: m }
      );
    }
  } catch (e) {
    console.error(e);
  }
};

handler.command = /^(hidetag|notificar|notify)$/i;
handler.group = true;
handler.admin = true;

export default handler;
