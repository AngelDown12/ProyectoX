let handler = async (m, { isPrems, conn }) => {
let time = global.db.data.users[m.sender].lastcofre + 0 // 36000000 10 Horas //86400000 24 Horas
if (new Date - global.db.data.users[m.sender].lastcofre < 0) throw `[❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚂𝚃𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴\𝚗𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - new Date())}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚁`
await m.react('💳')
let img = './src/tienda.jpg'
let texto = `𝙀𝙡𝙞𝙩𝙚𝘽𝙤𝙩𝙂𝙡𝙤𝙗𝙖𝙡 -

Creado en el año 2023/07/15
𝘕𝘰𝘮𝘪𝘯𝘢𝘥𝘰 𝘤𝘰𝘮𝘰 𝘦𝘭 𝘮𝘦𝘫𝘰𝘳 𝘣𝘰𝘵 𝘥𝘦 𝘓𝘢𝘵𝘪𝘯𝘰𝘢𝘮𝘦́𝘳𝘪𝘤𝘢, 𝘫𝘶𝘯𝘵𝘰 𝘢 𝘱𝘳𝘰𝘺𝘦𝘤𝘵𝘰𝘟 . 🏆

𝘚𝘰𝘮𝘰𝘴 𝘱𝘳𝘰𝘧𝘦𝘴𝘪𝘰𝘯𝘢𝘭𝘦𝘴 𝘤𝘰𝘯 𝘮𝘢́𝘴 𝘥𝘦 3 𝘢𝘯̃𝘰𝘴 𝘥𝘦 𝘦𝘹𝘱𝘦𝘳𝘪𝘦𝘯𝘤𝘪𝘢, 𝘦𝘯 𝘥𝘦𝘴𝘢𝘳𝘳𝘰𝘭𝘭𝘰 𝘥𝘦 𝘣𝘰𝘵𝘴 , 𝘱𝘢́𝘨𝘪𝘯𝘢𝘴 𝘸𝘦𝘣, 𝘯𝘰𝘥𝘰𝘴𝘝𝘪𝘱 𝘺 𝘮𝘶𝘤𝘩𝘰 𝘮𝘢́𝘴 . 

INGRESA AL LINK :
https://sites.google.com/view/elitebotglobal?usp=sharing

 © 2023 EliteBotGlobal // ProyectoX`

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
await conn.sendFile(m.chat, img, 'img.jpg', texto, fkontak)
global.db.data.users[m.sender].lastcofre = new Date * 1
}
handler.command = ['tienda'] 
handler.register = false 
export default handler
