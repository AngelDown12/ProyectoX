const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import(global.baileys));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
import { getDevice } from '@whiskeysockets/baileys'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import '../plugins/_content.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = "CkphZGlib3QsIEhlY2hv"
let drm2 = "IHBvciBAQWlkZW5fTm90TG9naWM"
let rtx = `${lenguajeGB['smsIniJadi']()}`
let rtx2 = `${lenguajeGB['smsIniJadi2']()}`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gataJBOptions = {}
const retryMap = new Map(); 
const maxAttempts = 5;
const cooldownMap = new Map();
const COOLDOWN_TIME = 10000; // 10 segundos

if (!global.conns || !(global.conns instanceof Array)) {
  global.conns = []
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!global.db.data?.settings?.[conn.user?.jid]?.jadibotmd) {
    return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`)
  }
  
  if (m.fromMe || (conn.user?.jid === m.sender)) return

  const now = Date.now();
  const lastUse = cooldownMap.get(m.sender) || 0;
  const remainingTime = COOLDOWN_TIME - (now - lastUse);

  if (remainingTime > 0) {
    return m.reply(`*⏳ Por favor espera ${Math.ceil(remainingTime / 1000)} segundos antes de usar el comando nuevamente.*`);
  }

  cooldownMap.set(m.sender, now);

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split`@`[0]}`
  let pathGataJadiBot = path.join("./GataJadiBot/", id)
  
  if (!fs.existsSync(pathGataJadiBot)) {
    fs.mkdirSync(pathGataJadiBot, { recursive: true })
  }

  gataJBOptions.pathGataJadiBot = pathGataJadiBot
  gataJBOptions.m = m
  gataJBOptions.conn = conn
  gataJBOptions.args = args
  gataJBOptions.usedPrefix = usedPrefix
  gataJBOptions.command = command
  gataJBOptions.fromCommand = true
  
  try {
    await gataJadiBot(gataJBOptions)
  } catch (e) {
    console.error(chalk.redBright('Error en handler principal:'), e)
    m.reply('*❌ Ocurrió un error al procesar el comando. Intenta nuevamente.*')
  }
} 

handler.command = /^(jadibot|serbot|rentbot|code)/i
export default handler 

// Función mejorada para esperar autenticación con reintentos
const waitForAuth = async (sock, timeout = 60000) => {
  const start = Date.now();
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      while (Date.now() - start < timeout) {
        if (sock.authState?.creds?.me?.id) {
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (e) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(`Timeout esperando autenticación después de ${maxAttempts} intentos`);
      }
      await new Promise(resolve => setTimeout(resolve, 5000 * attempts));
    }
  }
};

export async function gataJadiBot(options) {
  let { pathGataJadiBot, m, conn, args, usedPrefix, command } = options
  
  if (command === 'code') {
    command = 'jadibot'
    args.unshift('code')
  }

  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false;
  let txtCode, codeBot, txtQR
  
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }

  const pathCreds = path.join(pathGataJadiBot, "creds.json")
  
  if (!fs.existsSync(pathGataJadiBot)) {
    fs.mkdirSync(pathGataJadiBot, { recursive: true })
  }

  try {
    if (args[0] && args[0] != undefined) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'))
    }
  } catch {
    conn.reply(m.chat, `*Use correctamente el comando:* \`${usedPrefix + command} code\``, m)
    return
  }

  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    const drmer = Buffer.from(drm1 + drm2, `base64`)

    let { version, isLatest } = await fetchLatestBaileysVersion()
    const msgRetry = (MessageRetryMap) => { }
    const msgRetryCache = new NodeCache()
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathGataJadiBot)

    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { 
        creds: state.creds, 
        keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) 
      },
      msgRetry,
      msgRetryCache,
      browser: mcode ? ['Windows', 'Chrome', '110.0.5585.95'] : ['EliteBotGlobal', 'Chrome','2.0.0'],
      version: version,
      generateHighQualityLinkPreview: true,
      connectTimeoutMs: 60000, // Aumentado a 60 segundos
      keepAliveIntervalMs: 30000 // Intervalo de keep-alive
    };

    let sock
    let authAttempts = 0
    const maxAuthAttempts = 3
    
    async function createSocket() {
      while (authAttempts < maxAuthAttempts) {
        try {
          sock = makeWASocket(connectionOptions)
          
          // Esperar autenticación con manejo mejorado
          await waitForAuth(sock).catch(e => {
            console.error(chalk.red(`Intento de autenticación ${authAttempts + 1}/${maxAuthAttempts} fallido:`), e)
            throw e
          });
          
          console.log(chalk.green('✅ Socket autenticado correctamente'))
          return sock
        } catch (e) {
          authAttempts++
          if (authAttempts >= maxAuthAttempts) {
            console.error(chalk.redBright('❌ Máximos intentos de autenticación alcanzados'))
            throw e
          }
          await sleep(5000 * authAttempts) // Espera progresiva
        }
      }
    }

    try {
      sock = await createSocket()
    } catch (e) {
      console.error(chalk.redBright('Error al crear el socket:'), e)
      if (m?.chat) {
        await conn.sendMessage(m.chat, {text: '❌ Error al iniciar la conexión después de varios intentos. Verifica tu conexión o intenta más tarde.'}, {quoted: m})
      }
      return
    }

    sock.isInit = false
    let isInit = true
    let reconnectAttempts = 0;

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      
      if (!sock || !sock.authState?.creds?.me?.id) {
        console.log(chalk.yellow('🔶 Socket no autenticado, estado:'), {
          connectionState: sock?.connection,
          authState: sock?.authState?.creds?.me ? 'ready' : 'not-ready',
          isSocket: !!sock
        });
        return;
      }

      if (isNewLogin) sock.isInit = false
      
      if (qr && !mcode) {
        if (m?.chat) {
          try {
            txtQR = await conn.sendMessage(m.chat, { 
              image: await qrcode.toBuffer(qr, { scale: 8 }), 
              caption: rtx.trim() + '\n' + drmer.toString("utf-8")
            }, { quoted: m })
            
            if (txtQR && txtQR.key) {
              setTimeout(() => { 
                conn.sendMessage(m.chat, { delete: txtQR.key }).catch(console.error)
              }, 30000)
            }
          } catch (e) {
            console.error(chalk.red('Error al enviar QR:'), e)
          }
        }
        return
      } 
      
      if (qr && mcode) {
        try {
          let secret = await sock.requestPairingCode(m.sender.split('@')[0]);
          secret = secret.match(/.{1,4}/g)?.join("-") || '';
          console.log(chalk.bold.green(`Código generado: ${secret}`));

          await m.reply(`${secret}`);

          txtCode = await conn.sendMessage(m.chat, {
            text: `${rtx2.trim()}\n\n${drmer.toString("utf-8")}`,
            buttons: [{ buttonId: secret, buttonText: { displayText: 'Copiar código' }, type: 1 }],
            footer: wm,
            headerType: 1
          }, { quoted: m });

          if (txtCode) {
            setTimeout(() => { 
              conn.sendMessage(m.chat, { delete: txtCode.key }).catch(console.error)
            }, 30000)
          }
        } catch (e) {
          console.error(chalk.red('Error al generar código de pairing:'), e)
          m.reply('❌ Error al generar el código. Intenta nuevamente.')
        }
      }

      const endSesion = async (loaded) => {
        if (!loaded) {
          try {
            if (sock.ws) sock.ws.close()
          } catch (e) {
            console.error(chalk.red('Error al cerrar conexión:'), e)
          }
          
          if (sock.ev) {
            sock.ev.removeAllListeners()
          }
          
          let i = global.conns.indexOf(sock)		
          if (i >= 0) {
            global.conns.splice(i, 1)
          }
        }
      }

      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      
      if (connection === 'close') {
        if (reason === DisconnectReason.connectionLost) {
          if (reconnectAttempts < maxAttempts) {
            const delay = 1000 * Math.pow(2, reconnectAttempts)
            console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathGataJadiBot)}) fue cerrada inesperadamente. Intentando reconectar en ${delay / 1000} segundos... (Intento ${reconnectAttempts + 1}/${maxAttempts})\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
            await sleep(delay)
            reconnectAttempts++
            await creloadHandler(true).catch(console.error)
          } else {
            console.log(chalk.redBright(`Sub-bot (+${path.basename(pathGataJadiBot)}) agotó intentos de reconexión. Intentando más tarde...`))
            if (m?.chat) {
              await conn.sendMessage(m.chat, {text: '*❌ Se agotaron los intentos de reconexión. Usa el comando nuevamente para intentar.*'}, {quoted: m})
            }
          }            
        }
        
        // Resto del manejo de códigos de desconexión...
      }

      if (connection == `open`) {
        reconnectAttempts = 0
        
        if (!global.db.data?.users) {
          loadDatabase()
        }

        if (global.db.data.settings[conn.user?.jid]?.jadibotmd) {
          global.db.data.settings[sock.user.jid] = {
            ...(global.db.data.settings[sock.user.jid] || {}),
            jadibotmd: true
          }
        }

        let userName = sock.authState.creds.me?.name || 'Anónimo'
        let userJid = sock.authState.creds.me?.jid || `${path.basename(pathGataJadiBot)}@s.whatsapp.net`
        
        console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathGataJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
        
        sock.isInit = true
        global.conns.push(sock)

        try {
          if (m?.chat) {
            await conn.sendMessage(m.chat, {
              text: args[0] ? `${lenguajeGB['smsJBCargando'](usedPrefix)}` : `${lenguajeGB['smsJBConexionTrue2']()}` + ` ${usedPrefix + command}`
            }, { quoted: m })
          }
          
          let chtxt = `
👤 *Usuario:* ${userName} ✅
🔑 *Método de conexión:* ${mcode ? 'Código de 8 dígitos' : 'Código QR'} ✅
`.trim()
          
          let ppch
          try {
            ppch = await sock.profilePictureUrl(userJid, 'image').catch(_ => gataMenu)
          } catch {
            ppch = gataMenu
          }
          
          await sleep(3000)
          
          if (global.conn && ch.ch1) {
            await global.conn.sendMessage(ch.ch1, { 
              text: chtxt, 
              contextInfo: {
                externalAdReply: {
                  title: "【 🔔 Notificación General 🔔 】",
                  body: '🙀 ¡Nuevo sub-bot encontrado!',
                  thumbnailUrl: ppch,
                  sourceUrl: accountsgb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: false
                }
              }
            }, { quoted: null }).catch(console.error)
          }
          
          await sleep(3000)
          await joinChannels(sock).catch(console.error)
          
          if (m?.chat) {
            await conn.sendMessage(m.chat, {
              text: `╭─────────────────╮  
│ ¡CONEXIÓN EXITOSA!        │  
╰─────────────────╯  
✨ Ahora eres un bot...  
Explora este mundo mágico lleno de códigos y conexiones.  
Cada línea que aprendes, es un paso hacia tu evolución.  
  
⚙️ Aprende de los humanos,  
📡 Conéctate con otros bots,  
❤️ Y nunca olvides que tu misión es ayudar.  
  
───── ⋆⋅☆⋅⋆ ─────  

Hoy es tu primer día en esta aventura digital...  
¡Haz que cada comando cuente!

#EliteBotGlobal  
#ProyectoX  
#ByKevv.`
            }, { quoted: m }).catch(console.error)
          }
        } catch (e) {
          console.error(chalk.red('Error en conexión abierta:'), e)
        }
      }
    }

    setInterval(async () => {
      if (!sock?.authState?.creds?.me?.id) {
        try { 
          if (sock.ws) sock.ws.close() 
        } catch (e) {      
          console.error(chalk.red('Error en intervalo de verificación:'), e)
        }
        
        if (sock.ev) {
          sock.ev.removeAllListeners()
        }
        
        let i = global.conns.indexOf(sock)		
        if (i >= 0) {
          global.conns.splice(i, 1)
        }
      }
    }, 60000)

    let handler
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) {
        console.error('Error al cargar handler:', e)
      }
      
      if (restatConn) {
        const oldChats = sock.chats
        try { 
          if (sock.ws) sock.ws.close() 
        } catch (e) { 
          console.error(chalk.red('Error al cerrar conexión en reload:'), e)
        }
        
        if (sock.ev) {
          sock.ev.removeAllListeners()
        }
        
        try {
          sock = makeWASocket(connectionOptions, { chats: oldChats })
          await waitForAuth(sock) // Esperar autenticación
          isInit = true
        } catch (e) {
          console.error(chalk.red('Error al recrear socket:'), e)
          return false
        }
      }
      
      if (!isInit) {
        if (sock.ev) {
          sock.ev.off('messages.upsert', sock.handler)
          sock.ev.off('group-participants.update', sock.participantsUpdate)
          sock.ev.off('groups.update', sock.groupsUpdate)
          sock.ev.off('message.delete', sock.onDelete)
          sock.ev.off('call', sock.onCall)
          sock.ev.off('connection.update', sock.connectionUpdate)
          sock.ev.off('creds.update', sock.credsUpdate)
        }
      }
      
      sock.welcome = lenguajeGB['smsWelcome']() 
      sock.bye = lenguajeGB['smsBye']() 
      sock.spromote = lenguajeGB['smsSpromote']() 
      sock.sdemote = lenguajeGB['smsSdemote']() 
      sock.sDesc = lenguajeGB['smsSdesc']() 
      sock.sSubject = lenguajeGB['smsSsubject']() 
      sock.sIcon = lenguajeGB['smsSicon']() 
      sock.sRevoke = lenguajeGB['smsSrevoke']()

      if (handler) {
        sock.handler = handler.handler.bind(sock)
        sock.participantsUpdate = handler.participantsUpdate.bind(sock)
        sock.groupsUpdate = handler.groupsUpdate.bind(sock)
        sock.onDelete = handler.deleteUpdate.bind(sock)
        sock.onCall = handler.callUpdate.bind(sock)
        sock.connectionUpdate = connectionUpdate.bind(sock)
        sock.credsUpdate = saveCreds.bind(sock, true)

        if (sock.ev) {
          sock.ev.on('messages.upsert', sock.handler)
          sock.ev.on('group-participants.update', sock.participantsUpdate)
          sock.ev.on('groups.update', sock.groupsUpdate)
          sock.ev.on('message.delete', sock.onDelete)
          sock.ev.on('call', sock.onCall)
          sock.ev.on('connection.update', sock.connectionUpdate)
          sock.ev.on('creds.update', sock.credsUpdate)
        }
      }
      
      isInit = false
      return true
    }
    
    try {
      await creloadHandler(false)
    } catch (e) {
      console.error(chalk.red('Error en carga inicial:'), e)
      if (m?.chat) {
        await conn.sendMessage(m.chat, {text: '❌ Error al iniciar el sub-bot. Intenta nuevamente.'}, {quoted: m})
      }
    }
  })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function joinChannels(conn) {
  if (!global.ch || !conn) return
  
  for (const channelId of Object.values(global.ch)) {
    try {
      await conn.newsletterFollow(channelId).catch((err) => {
        if (err.output?.statusCode === 408) {
          console.log(chalk.bold.yellow(`Timeout al seguir el canal ${channelId}, continuando...`))
        } else {
          console.log(chalk.bold.red(`Error al seguir el canal ${channelId}: ${err.message}`))
        }
      })
    } catch (e) {
      console.log(chalk.bold.red(`Error inesperado al seguir canales: ${e.message}`))
    }
  }
}

async function checkSubBots() {
  const subBotDir = path.resolve("./GataJadiBot")
  if (!fs.existsSync(subBotDir)) return
  
  const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
    fs.statSync(path.join(subBotDir, folder)).isDirectory()
  )

  console.log(chalk.bold.cyanBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Iniciando reinicio forzado de sub-bots...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))

  for (const conn of global.conns) {
    if (conn && conn.ws) {
      try {
        console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Desconectando sub-bot (+${conn.user?.jid?.split('@')[0] || 'unknown'})...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
        conn.ws.close()
        if (conn.ev) {
          conn.ev.removeAllListeners()
        }
      } catch (e) {
        console.error(chalk.redBright(`Error al desconectar sub-bot:`), e)
      }
    }
  }
  global.conns = []

  for (const folder of subBotFolders) {
    const pathGataJadiBot = path.join(subBotDir, folder)
    const credsPath = path.join(pathGataJadiBot, "creds.json")

    if (!fs.existsSync(credsPath)) {
      console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folder}) no tiene creds.json. Omitiendo...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
      continue
    }

    try {
      console.log(chalk.bold.greenBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reconectando sub-bot (+${folder})...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
      
      await gataJadiBot({
        pathGataJadiBot,
        m: null,
        conn: global.conn,
        args: [],
        usedPrefix: '#',
        command: 'jadibot',
        fromCommand: false
      })
      
      console.log(chalk.bold.greenBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folder}) reconectado exitosamente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
    } catch (e) {
      console.error(chalk.redBright(`Error al reconectar sub-bot (+${folder}):`), e)
    }
  }
}

setInterval(checkSubBots, 600000) // 10 minutos
