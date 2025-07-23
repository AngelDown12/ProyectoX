var handler = async (m, {conn, groupMetadata }) => {

conn.reply(m.chat, `𝙗𝙪𝙪 𝙗𝙤𝙩 𝙤𝙛𝙞𝙘𝙞𝙖𝙡 \n\n𝗘𝗹 𝗜𝗗 𝗱𝗲 𝗲𝘀𝘁𝗲 𝗴𝗿𝘂𝗽𝗼 𝗲𝘀 :\n${await groupMetadata.id}`, fkontak, )

}
handler.help = ['idgc']
handler.tags = ['grupo']
handler.command = /^(cekid|idgrupo|id)$/i

handler.group = true

export default handler  
