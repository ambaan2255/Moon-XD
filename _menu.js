const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const plugins = require("../lib/plugins.js");
const {
	OWNER_NAME,
	BOT_NAME,
	HANDLERS
} = require("../config.js");
const font = require("@viper-x/fancytext");
const fs = require("fs");
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
let img = fs.readFileSync('./banner.png')
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
				m.send(font.tiny(menu))
			}
		} catch (e) {
			console.log(`hey : ${e}`)
		}
	}
);
