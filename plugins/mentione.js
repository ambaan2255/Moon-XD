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
        let SUDO = "919497705819";
if(SUDO.split(",").some((number) => args.includes(number))) {
              const Audios = await (await fetch(songMsg)).buffer()
await client.sendMessage(m.jid,{audio: Audios,mimetype: 'audio/mp4', ptt: false,
contextInfo: 
{ externalAdReply: {
title: "SUPERIOR IS HERE",
body: "ʜʏ ʙʀᴏ!",
sourceUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: imgMsg }} },{quoted: m })
    
} });
