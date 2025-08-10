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
/*cmd({
	name: "alive",
	fromMe: isPublic,
	},
		async ({
			m,
			client,
			args
		}) => {
let img = "https://files.catbox.moe/hu1v4v.mp4"
await client.sendMessage(m.jid,{audio: {url: img},mimetype: 'audio/mp4', ptt: true, contextInfo: { externalAdReply: {
title: "MOON-XD IS ALIVE",
body: "ᴍᴀᴅᴇ ʙʏ ꜱᴜᴩᴇʀɪᴏʀ",
sourceUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaTypT,
showAdAttribution: false,
renderLargerThumbnail: true,
thumbnailUrl: " https://cdn.ironman.my.id/q/zRfLV.jpg" }} },{quoted: m}) });*/

cmd({
		name: "mee",
		fromMe: isPublic,
	},
	async ({
		m,
		client,
		args
	}) => {
		m.sendMsg(m.jid, `> @${m.sender.split("@")[0]}`, {
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
		let run = await client.sendMessage(m.jid,{text: `ꜰɪɴᴅɪɴɢ ᴛɪᴍᴇ.`},{quoted: m})
			await client.sendMessage(m.jid,{text: `ʀᴜɴᴛɪᴍᴇ : ${await m.runtime()}`, edit: run.key})
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
			text: "ᴛᴇꜱᴛɪɴɢ."
		}, {
			quoted: m
		})
		const end = new Date().getTime();

		await client.sendMessage(m.jid, {
			text: `ꜱᴩᴇᴇᴅ : ${end - start} ᴍꜱ`,
			edit: pong.key
		})
	});
cmd({
		name: "alive",
		fromMe: isPublic,
	},
	async ({
		m,
		client,
		args
	}) => {
		let nova = await client.sendMessage (m.jid,{text:`MOON-XD IS ALIVE`})
		let img = "https://files.catbox.moe/hu1v4v.mp4"
await client.sendMessage(nova,{audio: {url: img},mimetype: 'audio/mp4', ptt: true}),{quoted:m}
	})
