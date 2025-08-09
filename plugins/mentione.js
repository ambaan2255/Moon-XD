const {cmd, isPublic} = require("../lib/plugins.js");
const {SUDO} = require('../config.js');
const {toAudio} = require("../lib/functions.js");
const fetch = require("node-fetch");



cmd({
    on: "text",
    fromMe: isPublic,
},
    async({
        m, client, args
    })=> {
      //  if ( MENTIONE === "true" ? "false" : true && false ) {
        let song = [ "https://cdn.ironman.my.id/q/yjryp.mp4","https://cdn.ironman.my.id/q/ywecS.mp4","https://cdn.ironman.my.id/q/zRSwS.mp4","https://cdn.ironman.my.id/q/FpJYh.mp4","https://cdn.ironman.my.id/q/wVHal.mp4",];
        const songMsg = song[Math.floor(Math.random() * song.length)];
        let img = ["https://cdn.ironman.my.id/q/zRfLV.jpg","https://cdn.ironman.my.id/q/xxBax.jpg","https://cdn.ironman.my.id/q/DhBxA.jpg","https://cdn.ironman.my.id/q/HElrw.jpg","https://cdn.ironman.my.id/q/etLJh.jpg",];
        const imgMsg = img[Math.floor(Math.random() * img.length)];
        let SUDO = "916282088181";
if (!m.fromMe && ([SUDO.split(','), m.jid?.split('@')[0]].some(number => m?.text?.includes(number)) || [SUDO.split(','), m.jid?.split('@')[0]].some(number => m.mentions?.some(mention => mention?.startsWith(number))))){
              const Audios = await (await fetch(songMsg)).buffer()
await client.sendMessage(m.jid,{audio: Audios,mimetype: 'audio/mp4', ptt: true,
contextInfo: 
{ externalAdReply: {
title: "MooN~XD",
body: "ʜʏ ʙʀᴏ!",
sourceUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false,
thumbnailUrl: imgMsg }} },{quoted: m })
    
} });
