process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import fs, { watchFile, unwatchFile, writeFileSync, readdirSync, statSync, unlinkSync, existsSync, readFileSync, copyFileSync, watch, rmSync, readdir, stat, mkdirSync, rename } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { format } from 'util';
import pino from 'pino';
import Pino from 'pino';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import PQueue from 'p-queue';
import Datastore from '@seald-io/nedb';
import store from './lib/store.js';
import readline from 'readline';
import NodeCache from 'node-cache';
import { gataJadiBot } from './plugins/jadibot-serbot.js';
import pkg from 'google-libphonenumber';

const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();
const { makeInMemoryStore, DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = await import('@whiskeysockets/baileys');
const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; 

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.timestamp = { start: new Date };
const __dirname = global.__dirname(import.meta.url);
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

// Mensajes de consola con chalk
console.log(chalk.bold.hex('#FFA500')('╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.hex('#FFA500')('║            INICIALIZANDO GATA BOT              ║'));
console.log(chalk.bold.hex('#FFA500')('╚════════════════════════════════════════════════╝'));

// Configuración de base de datos con mensajes estilizados
const dbPath = path.join(__dirname, 'database');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
  console.log(chalk.green.bold('✓ Directorio de base de datos creado'));
} else {
  console.log(chalk.yellow.bold('! Directorio de base de datos ya existe'));
}

// [Resto de tu configuración de DB...]

// Conexión con mensajes detallados
const connectionUpdate = (update) => {
  const { connection, lastDisconnect } = update;
  
  if (connection === 'open') {
    console.log(chalk.green.bold('✓ Conexión establecida con WhatsApp'));
    console.log(chalk.blue(`🟢 Estado: ${connection}`));
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    console.log(chalk.red.bold('✗ Conexión cerrada:'));
    
    const statusMessages = {
      [DisconnectReason.badSession]: chalk.yellow('Sesión inválida, regenerando...'),
      [DisconnectReason.connectionClosed]: chalk.yellow('Conexión cerrada voluntariamente'),
      [DisconnectReason.connectionLost]: chalk.yellow('Conexión perdida con el servidor'),
      [DisconnectReason.connectionReplaced]: chalk.yellow('Nueva conexión abierta'),
      [DisconnectReason.loggedOut]: chalk.red('Sesión cerrada, por favor escanea QR nuevamente'),
      [DisconnectReason.restartRequired]: chalk.blue('Reinicio requerido'),
      [DisconnectReason.timedOut]: chalk.yellow('Tiempo de espera agotado'),
    };

    console.log(statusMessages[reason] || chalk.red(`Razón desconocida: ${reason}`));
  }
};

// [Resto de tus handlers...]

// Inicialización con mensajes de estado
async function initialize() {
  try {
    console.log(chalk.blue.bold('⌛ Cargando base de datos...'));
    await global.db.loadDatabase();
    console.log(chalk.green.bold('✓ Base de datos cargada correctamente'));

    console.log(chalk.blue.bold('⌛ Inicializando plugins...'));
    await filesInit(pluginFolder);
    console.log(chalk.green.bold(`✓ ${Object.keys(global.plugins).length} plugins cargados`));

    console.log(chalk.blue.bold('⌛ Verificando dependencias...'));
    await _quickTest();
    console.log(chalk.green.bold('✓ Dependencias verificadas'));

    console.log(chalk.bold.hex('#FFA500')('\n╔════════════════════════════════════════════════╗'));
    console.log(chalk.bold.hex('#FFA500')('║      GATA BOT INICIALIZADO CORRECTAMENTE      ║'));
    console.log(chalk.bold.hex('#FFA500')('╚════════════════════════════════════════════════╝'));
  } catch (error) {
    console.log(chalk.red.bold('✗ Error durante la inicialización:'));
    console.error(error);
    process.exit(1);
  }
}

// [Resto de tus funciones...]

// Inicialización final con estilos
initialize().then(() => {
  // Mensaje de éxito
  console.log(chalk.bold.green('\n✅ Bot listo para recibir comandos'));
  console.log(chalk.blue(`🔹 Versión Node: ${process.version}`));
  console.log(chalk.blue(`🔹 Memoria usada: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`));
}).catch(err => {
  console.log(chalk.red.bold('\n❌ Error crítico durante la inicialización:'));
  console.error(err);
  process.exit(1);
});
