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
        let img = "https://cdn.ironman.my.id/q/SOLBC.mp4"
        let SUDO = "919497705819,919961857267";
if(SUDO.split(",").some((number) => args.includes(number))) {
              const Audios = await (await fetch(img)).buffer()
await client.sendMessage(m.jid,{audio: Audios,mimetype: 'audio/mp4', ptt: true,
contextInfo: 
{ externalAdReply: {
title: "HY SUPERIOR IS HERE",
body: "ᴇɴᴛʜɪɴᴀ ᴍᴡᴏɴᴇ ᴍᴇɴᴛɪᴏɴ ᴄʜᴇʏᴛʜᴇ",
sourceUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: " https://cdn.ironman.my.id/q/lYXtA.jpg"}} },{quoted: m })
    
} });
