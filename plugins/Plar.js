import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { savetube } from '../lib/yt-savetube.js';
import { ogmp3 } from '../lib/youtubedl.js';
import { amdl } from '../lib/scraper.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ytmp3, ytmp4 } = require("@hiudyy/ytdl");

const LimitAud = 725 * 1024 * 1024; // 725MB
const LimitVid = 425 * 1024 * 1024; // 425MB
const youtubeRegexID = /(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
const userCaptions = new Map();
const userRequests = {};

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) return m.reply(`🤔 ${await tr("¿Qué está buscando?")} 🤔\n*${await tr("Ingrese el nombre de la canción")}\n\n${await tr("Ejemplo:")}*\n${usedPrefix + command} emilia 420`);

  const tipoDescarga = command === 'play' || command === 'musica' ? 'audio'
    : command === 'play2' ? 'video'
    : command === 'play3' ? 'audio (documento)'
    : command === 'play4' ? 'video (documento)' : '';

  if (userRequests[m.sender]) return await conn.reply(m.chat,
    `⏳ ${await tr("Hey")} @${m.sender.split('@')[0]} ${await tr("espera pendejo, ya estás descargando algo")} 🙄\n${await tr("Espera a que termine tu solicitud actual antes de hacer otra...")}`,
    userCaptions.get(m.sender) || m);

  userRequests[m.sender] = true;

  try {
    let videoIdToFind = text.match(youtubeRegexID) || null;
    const yt_play = await search(args.join(' '));
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);
    if (videoIdToFind) {
      const videoId = videoIdToFind[1];
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId);
    }
    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;

    const PlayText = await conn.sendMessage(m.chat, {
      text: `${yt_play[0].title}
⇄ㅤ     ◁   ㅤ  ❚❚ㅤ     ▷ㅤ     ↻

⏰ ${await tr("Duración")}: ${secondString(yt_play[0].duration.seconds)}
👉🏻 ${await tr("Aguarde un momento en lo que envío su")} ${tipoDescarga}`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363355261011910@newsletter',
          serverMessageId: '',
          newsletterName: 'LoliBot ✨️'
        },
        forwardingScore: 9999999,
        isForwarded: true,
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: yt_play[0].title,
          body: wm,
          containsAutoReply: true,
          mediaType: 1,
          thumbnailUrl: yt_play[0].thumbnail,
          sourceUrl: [nna, nna2, nnaa].getRandom()
        }
      }
    }, { quoted: m });

    userCaptions.set(m.sender, PlayText);

    const [input, qualityInput = (command === 'play' || command === 'musica' || command === 'play3') ? '320' : '720'] = text.split(' ');
    const audioQualities = ['64', '96', '128', '192', '256', '320'];
    const videoQualities = ['240', '360', '480', '720', '1080'];
    const isAudioCommand = command === 'play' || command === 'musica' || command === 'play3';
    const selectedQuality = (isAudioCommand ? audioQualities : videoQualities).includes(qualityInput) ? qualityInput : (isAudioCommand ? '320' : '720');
    const isAudio = command.toLowerCase().includes('mp3') || command.toLowerCase().includes('audio');
    const format = isAudio ? 'mp3' : '720';

    const audioApis = [/*...tu lista original*/];
    const videoApis = [/*...tu lista original*/];

    const download = async (apis) => {
      let mediaData = null;
      let isDirect = false;
      for (const api of apis) {
        try {
          const data = await api.url();
          const { data: extractedData, isDirect: direct } = api.extract(data);
          if (extractedData) {
            const size = await getFileSize(extractedData);
            if (size >= 1024) {
              mediaData = extractedData;
              isDirect = direct;
              break;
            }
          }
        } catch (e) {
          console.log(`Error con API: ${e}`);
          continue;
        }
      }
      return { mediaData, isDirect };
    };

    // Envío según el comando
    if (['play', 'musica'].includes(command)) {
      const { mediaData, isDirect } = await download(audioApis);
      if (mediaData) {
        const fileSize = await getFileSize(mediaData);
        await conn.sendMessage(m.chat, fileSize > LimitAud
          ? { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title}.mp3` }
          : { audio: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg' }, { quoted: m });
      }
    }

    if (['play2', 'video'].includes(command)) {
      const { mediaData, isDirect } = await download(videoApis);
      if (mediaData) {
        const fileSize = await getFileSize(mediaData);
        const msgOpts = {
          fileName: `${yt_play[0].title}.mp4`,
          caption: `🔰 ${await tr("Aquí está tu video")}\n🔥 ${await tr("Título")}: ${yt_play[0].title}`,
          mimetype: 'video/mp4'
        };
        await conn.sendMessage(m.chat, fileSize > LimitVid
          ? { document: isDirect ? mediaData : { url: mediaData }, ...msgOpts }
          : { video: isDirect ? mediaData : { url: mediaData }, thumbnail: yt_play[0].thumbnail, ...msgOpts }, { quoted: m });
      }
    }

    if (command === 'play3') {
      const { mediaData, isDirect } = await download(audioApis);
      if (mediaData) {
        await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title}.mp3` }, { quoted: m });
      }
    }

    if (command === 'play4') {
      const { mediaData, isDirect } = await download(videoApis);
      if (mediaData) {
        await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, fileName: `${yt_play[0].title}.mp4`, caption: `🔰${await tr("Título")}: ${yt_play[0].title}`, thumbnail: yt_play[0].thumbnail, mimetype: 'video/mp4' }, { quoted: m });
      }
    }

  } catch (e) {
    console.error(e);
    m.react("❌");
  } finally {
    delete userRequests[m.sender];
  }
};

handler.help = ['play', 'play2', 'play3', 'play4', 'musica', 'video', 'playdoc', 'playdoc2'];
handler.tags = ['downloader'];
handler.command = ['play', 'play2', 'play3', 'play4', 'musica', 'video', 'playdoc', 'playdoc2'];
handler.register = true;
export default handler;

// Funciones auxiliares
async function search(query, options = {}) {
  const res = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
  return res.videos;
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d ? d + ' día(s), ' : ''}${h ? h + ' hora(s), ' : ''}${m ? m + ' minuto(s), ' : ''}${s ? s + ' segundo(s)' : ''}`;
}

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return parseInt(res.headers.get('content-length') || 0);
  } catch {
    return 0;
  }
  }
