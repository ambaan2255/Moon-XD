const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const {
	performance
} = require('perf_hooks')
const font = require("@viper-x/fancytext");

cmd({
		name: "jid",
		fromMe: isPublic,
	},
	async ({
		m,
		client,
		args
	}) => {
		m.reply(`${m.jid}`)
	})

cmd({
		name: "mee",
		fromMe: isPublic,
	},
	async ({
		m,
		client,
		args
	}) => {
		m.sendMsg(m.jid, `@${m.sender.split("@")[0]}`, {
			mentions: [m.sender]
		})
	})

cmd({
		name: "runtime",
		fromMe: true,
		category: "misc",
		desc: "To check bot runtime"
	},
	async ({
		m,
		client
	}) => {
		return m.reply(`Runtime : ${await m.runtime()}`)
	});


cmd({
		name: "ping",
		fromMe: isPublic,
		category: "misc",
		desc: "To check ping"
	},
	async ({
		m,
		client
	}) => {

		const start = new Date().getTime();

		let pong = await client.sendMessage(m.jid, {
			text: "..."
		}, {
			quoted: m
		})
		const end = new Date().getTime();

		await client.sendMessage(m.jid, {
			text: `Latency : ${end - start} ms`,
			edit: pong.key
		})
	});
