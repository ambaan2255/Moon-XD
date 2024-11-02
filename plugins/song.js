const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const {
	existsSync,
	mkdirSync,
	writeFileSync,
	readFileSync,
	createWriteStream
} = require('fs');
const fetch = require('node-fetch')
const yts = require("yt-search")
const ytdl = require("youtubedl-core");
const NodeID3 = require('node-id3')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const axios = require("axios")
const {
	AddMp3Meta,
	getBuffer,
	getJson
} = require("../lib/functions.js");
const {
	prepareWAMessageMedia,
} = require('@whiskeysockets/baileys');
const isUrl = (url) => {
    return new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
        "gi"
    ).test(url);
}


cmd({
		name: "yt",
		fromMe: isPublic,
		category: "downloader",
		desc: "To download yt vid/aud"
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!args) return m.reply("Enter Youtube Link!")

		const regex = /(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/;

		if (!isUrl(args)) return m.reply("Enter Youtube Link!")

		let response = await getJson(`https://viper.xasena.me/api/v1/yta?query=${args}`);
		let coverBuffer = await getBuffer(response.data.thumbnail);
		var img = await prepareWAMessageMedia({
			image: coverBuffer
		}, {
			upload: client.waUploadToServer
		})
		m.sendMsg(m.jid, {
			header: {
				title: `${response.data.title}`,
				subtitle: " ",
				imageMessage: img.imageMessage,
				hasMediaAttachment: true,
			},
			button: [{
				type: "reply",
				params: {
					display_text: "AUDIO",
					id: `song ${response.data.title} `,
				},
			}, {
				type: "reply",
				params: {
					display_text: "VIDEO",
					id: `ytdlvid ${response.data.videoId}`,
				},
			}, ]
		}, {}, "interactive")

	})


cmd({
		name: "song",
		fromMe: isPublic,
		category: "downloader",
		desc: "To download song"
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!args) return m.reply("Enter Query!")
		let mes = await client.sendMessage(m.jid, {
			text: `...`
		}, {
			quoted: m
		})
		let response = await getJson(`https://viper.xasena.me/api/v1/yta?query=${args}`);
		let coverBuffer = await getBuffer(response.data.thumbnail);
		client.sendMessage(m.jid, {
			text: `Downloading : ${response.data.title}`,
			edit: mes.key
		})
		const songbuff = await getBuffer(response.data.downloadUrl);
		const song = await AddMp3Meta(songbuff, coverBuffer, {
			title: response.data.title,
			artist: "" // response.data.channel.name
		})
		return await client.sendMessage(m.jid, {
			audio: song,
			mimetype: 'audio/mpeg'
		}, {
			quoted: m
		})

	})
