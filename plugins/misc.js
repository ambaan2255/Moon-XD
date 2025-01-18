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
title: "DEVU-MWOL-BOT IS ALIVE",
body: "ᴍᴀᴅᴇ ʙʏ ꜱᴜᴩᴇʀɪᴏʀ",
sourceUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaUrl: "https://www.instagram.com/4.4.4.4.4.4.4444",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true,
thumbnailUrl: " https://files.catbox.moe/j9axvb.png" }} },{quoted: m}) });

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
		let run = await client.sendMessage(m.jid,{text: `> _Finding Time_`},{quoted: m})
			await client.sendMessage(m.jid,{text: `> _Runtime : ${await m.runtime()}_`, edit: run.key})
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
			text: "> _Testing_"
		}, {
			quoted: m
		})
		const end = new Date().getTime();

		await client.sendMessage(m.jid, {
			text: `> _Speed : ${end - start} ms_`,
			edit: pong.key
		})
	});
