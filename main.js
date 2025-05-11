process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js' 
import './plugins/_content.js'
import { createRequire } from 'module'
import path, { join } from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { watchFile, unwatchFile, writeFileSync, readdirSync, statSync, unlinkSync, existsSync, readFileSync, copyFileSync, watch, rmSync, readdir, stat, mkdirSync, rename } from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { format } from 'util'
import pino from 'pino'
import Pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import PQueue from 'p-queue'
import Datastore from '@seald-io/nedb'
import store from './lib/store.js'
import readline from 'readline'
import NodeCache from 'node-cache'
import { gataJadiBot } from './plugins/jadibot-serbot.js'
import pkg from 'google-libphonenumber'

const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const { makeInMemoryStore, DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = await import('@whiskeysockets/baileys')
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.timestamp = { start: new Date }
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbPath = path.join(__dirname, 'database')
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath)

const collections = {
  users: new Datastore({ filename: path.join(dbPath, 'users.db'), autoload: true }),
  chats: new Datastore({ filename: path.join(dbPath, 'chats.db'), autoload: true }),
  settings: new Datastore({ filename: path.join(dbPath, 'settings.db'), autoload: true }),
  msgs: new Datastore({ filename: path.join(dbPath, 'msgs.db'), autoload: true }),
  sticker: new Datastore({ filename: path.join(dbPath, 'sticker.db'), autoload: true }),
  stats: new Datastore({ filename: path.join(dbPath, 'stats.db'), autoload: true }),
}

Object.values(collections).forEach(db => {
  db.setAutocompactionInterval(300000)
})

global.db = {
  data: {
    users: {},
    chats: {},
    settings: {},
    msgs: {},
    sticker: {},
    stats: {},
  },
}

function sanitizeId(id) {
  return id.replace(/\./g, '_')
}

function unsanitizeId(id) {
  return id.replace(/_/g, '.')
}

function sanitizeObject(obj) {
  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = key.replace(/\./g, '_')
    sanitized[sanitizedKey] = (typeof value === 'object' && value !== null) ? sanitizeObject(value) : value
  }
  return sanitized
}

function unsanitizeObject(obj) {
  const unsanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    const unsanitizedKey = key.replace(/_/g, '.')
    unsanitized[unsanitizedKey] = (typeof value === 'object' && value !== null) ? unsanitizeObject(value) : value
  }
  return unsanitized
}

global.db.readData = async function (category, id) {
  const sanitizedId = sanitizeId(id)
  if (!global.db.data[category][sanitizedId]) {
    const data = await new Promise((resolve, reject) => {
      collections[category].findOne({ _id: sanitizedId }, (err, doc) => {
        if (err) return reject(err)
        resolve(doc ? unsanitizeObject(doc.data) : {})
      })
    })
    global.db.data[category][sanitizedId] = data
  }
  return global.db.data[category][sanitizedId]
}

global.db.writeData = async function (category, id, data) {
  const sanitizedId = sanitizeId(id)
  global.db.data[category][sanitizedId] = {
    ...global.db.data[category][sanitizedId],
    ...sanitizeObject(data),
  }
  await new Promise((resolve, reject) => {
    collections[category].update(
      { _id: sanitizedId },
      { $set: { data: sanitizeObject(global.db.data[category][sanitizedId]) } },
      { upsert: true },
      (err) => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

global.db.loadDatabase = async function () {
  const loadPromises = Object.keys(collections).map(async (category) => {
    const docs = await new Promise((resolve, reject) => {
      collections[category].find({}, (err, docs) => {
        if (err) return reject(err)
        resolve(docs)
      })
    })
    const seenIds = new Set()
    for (const doc of docs) {
      const originalId = unsanitizeId(doc._id)
      if (seenIds.has(originalId)) {
        await new Promise((resolve, reject) => {
          collections[category].remove({ _id: doc._id }, {}, (err) => {
            if (err) return reject(err)
            resolve()
          })
        })
      } else {
        seenIds.add(originalId)
        if (category === 'users' && (originalId.includes('@newsletter') || originalId.includes('lid'))) continue
        if (category === 'chats' && originalId.includes('@newsletter')) continue
        global.db.data[category][originalId] = unsanitizeObject(doc.data)
      }
    }
  })
  await Promise.all(loadPromises)
}

global.db.save = async function () {
  const savePromises = []
  for (const category of Object.keys(global.db.data)) {
    for (const [id, data] of Object.entries(global.db.data[category])) {
      if (Object.keys(data).length > 0) {
        if (category === 'users' && (id.includes('@newsletter') || id.includes('lid'))) continue
        if (category === 'chats' && id.includes('@newsletter')) continue
        savePromises.push(
          new Promise((resolve, reject) => {
            collections[category].update(
              { _id: sanitizeId(id) },
              { $set: { data: sanitizeObject(data) } },
              { upsert: true },
              (err) => {
                if (err) return reject(err)
                resolve()
              }
            )
          })
        )
      }
    }
  }
  await Promise.all(savePromises)
}

global.db.loadDatabase().then(() => {
  console.log(chalk.bold.green('Base de datos lista'))
}).catch(err => {
  console.error(chalk.bold.red('Error cargando base de datos:'), err)
})

async function gracefulShutdown() {
  await global.db.save()
  console.log(chalk.bold.yellow('Guardando base de datos antes de cerrar...'))
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

global.creds = 'creds.json'
global.authFile = 'GataBotSession'
global.authFileJB = 'GataJadiBot'
global.rutaBot = join(__dirname, global.authFile)
global.rutaJadiBot = join(__dirname, global.authFileJB)
const respaldoDir = join(__dirname, 'BackupSession')
const credsFile = join(global.rutaBot, global.creds)
const backupFile = join(respaldoDir, global.creds)

if (!fs.existsSync(global.rutaJadiBot)) {
  fs.mkdirSync(global.rutaJadiBot)
}

if (!fs.existsSync(respaldoDir)) fs.mkdirSync(respaldoDir)

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile)
const msgRetryCounterMap = new Map()
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const {version} = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumberCode
const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
})

const question = (texto) => {
  rl.clearLine(rl.input, 0)
  return new Promise((resolver) => {
    rl.question(texto, (respuesta) => {
      rl.clearLine(rl.input, 0)
      resolver(respuesta.trim())
    })
  })
}

let opcion
if (methodCodeQR) {
  opcion = '1'
}

if (!methodCodeQR && !methodCode && !fs.existsSync(`./${global.authFile}/creds.json`)) {
  do {
    let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
    opcion = await question(`╭${lineM}  
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('┊')} ${chalk.blue.bgBlue.bold.cyan('Método de conexión')}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}   
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}     
┊ ${chalk.blueBright('┊')} ${chalk.green.bgMagenta.bold.yellow('Seleccione una opción:')}
┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright(`⇢  Opción 1:`)} ${chalk.greenBright('Conexión por QR')}
┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright(`⇢  Opción 2:`)} ${chalk.greenBright('Conexión por código')}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}     
┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta('Nota: El código QR se regenera cada minuto')}
┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta('El código numérico es de un solo uso')}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}    
┊ ${chalk.blueBright('┊')} ${chalk.red.bgRed.bold.green('Comandos disponibles:')}
┊ ${chalk.blueBright('┊')} ${chalk.italic.cyan('Para cambiar el método después:')}
┊ ${chalk.blueBright('┊')} ${chalk.italic.cyan('Detén el bot y usa:')}
┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm run qr ${chalk.italic.magenta(`(para conexión QR)`)})}
┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm run code ${chalk.italic.magenta(`(para código numérico)`)})}
┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm start ${chalk.italic.magenta(`(para método anterior)`)})}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
╰${lineM}\n${chalk.bold.magentaBright('---> ')}`)
    
    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.bold.redBright('Opción inválida, solo 1 o 2'))
    }
  } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${global.authFile}/creds.json`))
}

const filterStrings = [
  "Q2xvc2luZyBzdGFsZSBvcGVu", 
  "Q2xvc2luZyBvcGVuIHNlc3Npb24=", 
  "RmFpbGVkIHRvIGRlY3J5cHQ=", 
  "U2Vzc2lvbiBlcnJvcg==", 
  "RXJyb3I6IEJhZCBNQUM=", 
  "RGVjcnlwdGVkIG1lc3NhZ2U=" 
]

console.info = () => {} 
console.debug = () => {} 

function redefineConsoleMethod(methodName, filterStrings) {
  const originalConsoleMethod = console[methodName]
  console[methodName] = function() {
    const message = arguments[0]
    if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
      arguments[0] = ""
    }
    originalConsoleMethod.apply(console, arguments)
  }
}

['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings))

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile, 
  browser: opcion == '1' ? ['GataBot', 'Safari', '1.0.0'] : methodCodeQR ? ['GataBot', 'Safari', '1.0.0'] : ["GataBot", "Safari", "1.0.0"],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: false, 
  generateHighQualityLinkPreview: true, 
  syncFullHistory: false,
  getMessage: async (key) => {
    try {
      let jid = jidNormalizedUser(key.remoteJid)
      let msg = await store.loadMessage(jid, key.id)
      return msg?.message || ""
    } catch (error) {
      return ""
    }
  },
  msgRetryCounterCache: msgRetryCounterCache || new Map(),
  userDevicesCache: userDevicesCache || new Map(),
  version: version, 
  keepAliveIntervalMs: 55000, 
  maxIdleTimeMs: 60000, 
}
    
global.conn = makeWASocket(connectionOptions)

if (!fs.existsSync(`./${global.authFile}/creds.json`)) {
  if (opcion === '2' || methodCode) {
    opcion = '2'
    if (!global.conn.authState.creds.registered) {
      let addNumber
      if (!!phoneNumber) {
        addNumber = phoneNumber.replace(/[^0-9]/g, '')
      } else {
        do {
          phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright('Ingrese su número de WhatsApp (ej: +51987654321): ')))
          phoneNumber = phoneNumber.replace(/\D/g,'')
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`
          }
        } while (!await isValidPhoneNumber(phoneNumber))
        rl.close()
        addNumber = phoneNumber.replace(/\D/g, '')
        setTimeout(async () => {
          let codeBot = await global.conn.requestPairingCode(addNumber)
          codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
          console.log(chalk.bold.white(chalk.bgMagenta('Código de emparejamiento:')), chalk.bold.white(chalk.white(codeBot)))
        }, 2000)
      }
    }
  }
}

global.conn.isInit = false
global.conn.well = false

if (!global.opts['test']) {
  if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.save()
    if (global.opts['autocleartmp'] && (global.support || {}).find) {
      const tmp = [os.tmpdir(), 'tmp', "GataJadiBot"]
      tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '2', '-type', 'f', '-delete']))
    }
  }, 30 * 1000)
}

if (global.opts['server']) (await import('./server.js')).default(global.conn, PORT)

const backupCreds = () => {
  if (fs.existsSync(credsFile)) {
    fs.copyFileSync(credsFile, backupFile)
    console.log(chalk.green(`[✅] Respaldo creado en ${backupFile}`))
  } else {
    console.log(chalk.yellow('[⚠] No se encontró el archivo creds.json para respaldar.'))
  }
}

const restoreCreds = () => {
  if (fs.existsSync(credsFile)) {
    fs.copyFileSync(backupFile, credsFile)
    console.log(chalk.green(`[✅] creds.json reemplazado desde el respaldo.`))
  } else if (fs.existsSync(backupFile)) {
    fs.copyFileSync(backupFile, credsFile)
    console.log(chalk.green(`[✅] creds.json restaurado desde el respaldo.`))
  } else {
    console.log(chalk.yellow('[⚠] No se encontró ni el archivo creds.json ni el respaldo.'))
  }
}

setInterval(async () => {
  await backupCreds()
  console.log(chalk.blue('[♻️] Respaldo periódico realizado.'))
}, 5 * 60 * 1000)

async function connectionUpdate(update) {  
  const {connection, lastDisconnect, isNewLogin} = update
  global.stopped = connection
  if (isNewLogin) global.conn.isInit = true
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
  if (code && code !== DisconnectReason.loggedOut && global.conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error)
    global.timestamp.connect = new Date
  }
  if (global.db.data == null) global.db.loadDatabase()
  
  if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {
      console.log(chalk.bold.yellow('Escanea el código QR para iniciar sesión'))
    }
  }
  
  if (connection == 'open') {
    console.log(chalk.bold.greenBright('Conexión establecida correctamente'))
    await joinChannels(global.conn)
  }
  
  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      console.log(chalk.bold.cyanBright('Sesión inválida, regenerando...'))
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log(chalk.bold.magentaBright('Conexión cerrada voluntariamente'))
      restoreCreds()
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
      console.log(chalk.bold.blueBright('Conexión perdida con el servidor'))
      restoreCreds()
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log(chalk.bold.yellowBright('Nueva conexión abierta'))
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(chalk.bold.redBright('Sesión cerrada, por favor escanea QR nuevamente'))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.restartRequired) {
      console.log(chalk.bold.cyanBright('Reinicio requerido'))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.timedOut) {
      console.log(chalk.bold.yellowBright('Tiempo de espera agotado'))
      await global.reloadHandler(true).catch(console.error)
    } else {
      console.log(chalk.bold.redBright(`Error de conexión: ${reason}`))
    }
  }
}

process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')

global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  
  if (restatConn) {
    const oldChats = global.conn.chats
    try {
      global.conn.ws.close()
    } catch { }
    global.conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, {chats: oldChats})
    isInit = true
  }
  
  if (!isInit) {
    global.conn.ev.off('messages.upsert', global.conn.handler)
    global.conn.ev.off('group-participants.update', global.conn.participantsUpdate)
    global.conn.ev.off('groups.update', global.conn.groupsUpdate)
    global.conn.ev.off('message.delete', global.conn.onDelete)
    global.conn.ev.off('call', global.conn.onCall)
    global.conn.ev.off('connection.update', global.conn.connectionUpdate)
    global.conn.ev.off('creds.update', global.conn.credsUpdate)
  }
  
  // Información para Grupos
  global.conn.welcome = '¡Bienvenido al grupo!' 
  global.conn.bye = '¡Adiós!' 
  global.conn.spromote = '¡Ahora eres administrador!' 
  global.conn.sdemote = '¡Ya no eres administrador!' 
  global.conn.sDesc = '¡La descripción ha sido actualizada!' 
  global.conn.sSubject = '¡El nombre del grupo ha sido actualizado!' 
  global.conn.sIcon = '¡El icono del grupo ha sido actualizado!' 
  global.conn.sRevoke = '¡El enlace ha sido reiniciado!' 
  
  global.conn.handler = handler.handler.bind(global.conn)
  global.conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  global.conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  global.conn.onDelete = handler.deleteUpdate.bind(global.conn)
  global.conn.onCall = handler.callUpdate.bind(global.conn)
  global.conn.connectionUpdate = connectionUpdate.bind(global.conn)
  global.conn.credsUpdate = saveCreds.bind(global.conn, true)
  
  global.conn.ev.on('messages.upsert', global.conn.handler)
  global.conn.ev.on('group-participants.update', global.conn.participantsUpdate)
  global.conn.ev.on('groups.update', global.conn.groupsUpdate)
  global.conn.ev.on('message.delete', global.conn.onDelete)
  global.conn.ev.on('call', global.conn.onCall)
  global.conn.ev.on('connection.update', global.conn.connectionUpdate)
  global.conn.ev.on('creds.update', global.conn.credsUpdate)
  
  isInit = false
  return true
}

if (global.gataJadibts) {
  const readRutaJadiBot = readdirSync(global.rutaJadiBot)
  if (readRutaJadiBot.length > 0) {
    const creds = 'creds.json'
    for (const gjbts of readRutaJadiBot) {
      const botPath = join(global.rutaJadiBot, gjbts)
      const readBotPath = readdirSync(botPath)
      if (readBotPath.includes(creds)) {
        gataJadiBot({pathGataJadiBot: botPath, m: null, conn: global.conn, args: '', usedPrefix: '/', command: 'serbot'})
      }
    }
  }
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
global.plugins = {}

async function filesInit(folder) {
  for (const filename of readdirSync(folder)) {
    const fullPath = join(folder, filename)
    if (statSync(fullPath).isDirectory()) {
      await filesInit(fullPath)
    } else {
      try {
        const file = global.__filename(fullPath)
        const module = await import(file)
        global.plugins[filename] = module.default || module
      } catch (e) {
        conn.logger.error(e)
        delete global.plugins[filename]
      }
    }
  }
}

filesInit(pluginFolder).then(() => console.log(chalk.bold.green('Plugins cargados correctamente'))).catch(console.error)

global.reload = async (_ev, filename) => {
  if (filename) {
    const dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`Plugin actualizado - '${filename}'`)
      else {
        conn.logger.warn(`Plugin eliminado - '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`Nuevo plugin - '${filename}'`)
    
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    })
    
    if (err) conn.logger.error(`Error de sintaxis en '${filename}'\n${format(err)}`)
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
        global.plugins[filename] = module.default || module
      } catch (e) {
        conn.logger.error(`Error cargando plugin '${filename}\n${format(e)}'`)
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
      }
    }
  }
}

Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127)
        })
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false))
      })
    ])
  }))

  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find}
  Object.freeze(global.support)
}

function clearTmp() {
  const tmpDir = join(__dirname, 'tmp')
  const filenames = readdirSync(tmpDir)
  filenames.forEach(file => {
    const filePath = join(tmpDir, file)
    unlinkSync(filePath)
  })
}

async function purgeSession() {
  const sessionDir = './GataBotSession'
  try {
    if (!existsSync(sessionDir)) return
    const files = await readdir(sessionDir)
    const preKeys = files.filter(file => file.startsWith('pre-key-')) 
    const now = Date.now()
    const oneHourAgo = now - (24 * 60 * 60 * 1000) //24 horas
        
    for (const file of preKeys) {
      const filePath = join(sessionDir, file)
      const fileStats = await stat(filePath)
      if (fileStats.mtimeMs < oneHourAgo) { 
        try {
          await unlink(filePath)
          console.log(chalk.green(`[🗑️] Pre-key antigua eliminada: ${file}`))
        } catch (err) {
          console.error(chalk.red(`[⚠] Error al eliminar pre-key antigua ${file}: ${err.message}`))
        }
      } else {
        console.log(chalk.yellow(`[ℹ️] Manteniendo pre-key activa: ${file}`))
      }
    }
    console.log(chalk.cyanBright(`[🔵] Sesiones no esenciales eliminadas de ${global.authFile}`))
  } catch (err) {
    console.error(chalk.red(`[⚠] Error al limpiar: ${err.message}`))
  }
}

async function purgeSessionSB() {
  const jadibtsDir = './GataJadiBot/'
  try {
    if (!existsSync(jadibtsDir)) return
    const directories = await readdir(jadibtsDir)
    let SBprekey = []
    const now = Date.now()
    const oneHourAgo = now - (24 * 60 * 60 * 1000) //24 horas
    for (const dir of directories) {
      const dirPath = join(jadibtsDir, dir)
      const stats = await stat(dirPath)
      if (stats.isDirectory()) {
        const files = await readdir(dirPath)
        const preKeys = files.filter(file => file.startsWith('pre-key-') && file !== 'creds.json')
        SBprekey = [...SBprekey, ...preKeys]
        for (const file of preKeys) {
          const filePath = join(dirPath, file)
          const fileStats = await stat(filePath)
          if (fileStats.mtimeMs < oneHourAgo) { 
            try {
              await unlink(filePath)
              console.log(chalk.bold.green(`Pre-key antigua eliminada: ${file}`))
            } catch (err) {
              console.error(chalk.red(`Error al eliminar pre-key antigua ${file}: ${err.message}`))
            }
          } else {
            console.log(chalk.yellow(`Manteniendo pre-key activa: ${file}`))
          }
        }
      }
    }
    if (SBprekey.length === 0) {
      console.log(chalk.bold.green('No se encontraron pre-keys antiguas en sub-bots'))
    } else {
      console.log(chalk.cyanBright(`[🔵] Pre-keys antiguas eliminadas de sub-bots: ${SBprekey.length}`))
    }
  } catch (err) {
    console.log(chalk.bold.red('Error limpiando sesiones de sub-bots: ' + err))
  }
}

async function purgeOldFiles() {
  const directories = ['./GataBotSession/', './GataJadiBot/']
  for (const dir of directories) {
    try {
      if (!fs.existsSync(dir)) { 
        console.log(chalk.yellow(`[⚠] Carpeta no existe: ${dir}`))
        continue
      }
      const files = await fsPromises.readdir(dir) 
      for (const file of files) {
        if (file !== 'creds.json') {
          const filePath = join(dir, file)
          try {
            await fsPromises.unlink(filePath)
            console.log(chalk.green(`[🗑️] Archivo residual eliminado: ${file} en ${dir}`))
          } catch (err) {
            console.error(chalk.red(`[⚠] Error al eliminar ${file} en ${dir}: ${err.message}`))
          }
        }
      }
    } catch (err) {
      console.error(chalk.red(`[⚠] Error al limpiar ${dir}: ${err.message}`))
    }
  }
  console.log(chalk.cyanBright(`[🟠] Archivos residuales eliminados`))
}

setInterval(async () => {
  if (global.stopped === 'close' || !global.conn || !global.conn.user) return
  await clearTmp()
  console.log(chalk.bold.cyanBright('Limpieza de archivos temporales'))
}, 1000 * 60 * 3) //3 min 

setInterval(async () => {
  if (global.stopped === 'close' || !global.conn || !global.conn.user) return
  await purgeSessionSB()
  await purgeSession()
  console.log(chalk.bold.cyanBright('Limpieza de sesiones antiguas'))
  await purgeOldFiles()
  console.log(chalk.bold.cyanBright('Limpieza de archivos antiguos'))
}, 1000 * 60 * 10)

setInterval(async () => {
await purgeOldFiles()
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeOldFiles()))}, 1000 * 60 * 10)

_quickTest().then(() => conn.logger.info(chalk.bold(lenguajeGB['smsCargando']().trim()))).catch(console.error)

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.bold.greenBright(lenguajeGB['smsMainBot']().trim()))
import(`${file}?update=${Date.now()}`)
})
