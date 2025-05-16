// plugins/zzz-debug-owner.js
let handler = async (m, { conn }) => {
  m.reply('Tu JID es: ' + m.sender)
}
handler.command = /^myjid$/i
export default handler
