const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const plugins = require("../lib/plugins.js");
const {
	OWNER_NAME,
	BOT_NAME,
	MENU_URL,
	HANDLERS
} = require("../config.js");
const font = require("@viper-x/fancytext");
const fs = require("fs");
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
/*let img = fs.readFileSync('./banner.png')*/
cmd({
		name: "menu",
		category: "misc",
		fromMe: isPublic,
		desc: "Show All commands"
	},
	async ({
		client,
		m,
		args
	}) => {
		try {
			if (args) {
				for (let i of plugins.commands) {
					if (i.name.test(args)) {
						return m.reply(`Command : ${args.trim()}\nDescription : ${i.desc.toLowerCase()}`);
					}
				}
				return m.reply(font.tiny("Oops command not found"))
			} else {
				let [date,
					time
				] = new Date()
					.toLocaleString("en-IN", {
						timeZone: "Asia/Kolkata"
					})
					.split(",");
				let menu = `\n   WhatsApp Bot\n\n${readMore}`
				let cmnd = [];
				let cmd;
				let type = [];
				commands.map((command, num) => {

					if (command.name) {
						let cmdName = command.name
						cmd = cmdName.source.split('\\s*')[1]
							.toString()
							.match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
					}

					if (command.dontAddCommandList || cmd === undefined) return;

					if (!command.dontAddCommandList && cmd !== undefined) {
						let category;
						if (!command.category) {
							category = "misc";
						} else {
							category = command.category.toLowerCase();
						}
						cmnd.push({
							cmd,
							category: category
						});
						if (!type.includes(category)) type.push(category);
					}
				});
				cmnd.sort();
				type.sort().forEach((cmmd) => {
					menu += `\n 🍁 *${cmmd}*\n\n`
					let comad = cmnd.filter(({
						category
					}) => category == cmmd)
					comad.sort()
					comad.forEach(({
						cmd
					}, num) => {
						menu += `  ➪ ${cmd}\n`
					});
				});
				//m.sendMsg(m.jid , img , { caption: font.tiny(menu) } , "image" )
				let sperky = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Hallo" }, "message": { "contactMessage": { "displayName": "MOON-XD","vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
        return await client.sendMessage(m.jid ,{document: { url: 'https://i.ibb.co/2W0H9Jq/avatar-contact.png'
				}, text : font.tiny(menu),	mimetype: 'application/zip',
         fileName: BOT_NAME.split(";")[0],
         fileLength: "99999999999",

contextInfo: { externalAdReply: {                                           
title: font.tiny(`𝘏𝘦𝘭𝘭𝘰𝘸  ${m.pushName}`),
body: font.tiny(`𝘛𝘩𝘪𝘴 𝘪𝘴  ${BOT_NAME}`),
sourceUrl: URL,
mediaUrl: URL,
mediaType: 2,
showAdAttribution: true,
renderLargerThumbnail: true,
thumbnailUrl: `${MENU_URL}` }}},{ quoted: sperky })
            // let text = align(txt, centerAlign);
        /*return await client.sendMessage(m.jid , { text : `${menu}` , contextInfo: { externalAdReply: { title: font.tiny(`Hey there  ${m.pushName}`), sourceUrl: "ʜᴇᴍ", mediaUrl: "https://instagram.com/_viper.x0_", mediaType: 1, showAdAttribution: false, renderLargerThumbnail: true, thumbnailUrl: "https://i.imgur.io/3T1zSxj_d.webp?maxwidth=640&shape=thumb&fidelity=medium" }} }, {quoted: m })*/
          m.send(m.jid , font.tiny(menu))
        }
      } catch (e) {
        m.error(`hey : ${e}`)
      }
    }
);
