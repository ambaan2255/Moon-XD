const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const googleTTS = require('google-tts-api');
const fetch = require('node-fetch')
const {
	toAudio
} = require("../lib/functions.js");

cmd({
		name: "sticker",
		fromMe: isPublic,
		desc: "Converts an image to sticker",
		category: "convert",
	},
	async ({
		m,
		client,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.imageMessage || m.quoted.message.videoMessage || m.quoted.message.stickerMessage))
			return await m.reply("Reply to photo or video");
		if (args) {
			let [packname, author] = args.split(",");
			let buff = await m.quoted.download();
			m.sendMsg(m.jid, buff, {
				packname: packname || '',
				author: author || '',
				quoted: m
			}, "sticker")
		} else {
			let buff = await m.quoted.download();
			m.sendMsg(m.jid, buff, {
				packname: '',
				author: ' ',
				quoted: m
			}, "sticker")
		}
	}
);

cmd({
		name: "mp3",
		fromMe: isPublic,
		desc: "Converts an Video/Voice to Mp3",
		category: "convert",
	},
	async ({
		m,
		client,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.audioMessage || m.quoted.message.videoMessage))
			return await m.reply("ʀᴇᴩʟᴀʏ ᴛᴏ ᴠɪᴅᴇᴏ ᴏʀ ᴠᴏɪᴄᴇ.!");
		let buff = await toAudio(await m.quoted.download(), "mp4");
		return m.sendMsg(m.jid, buff, {
			mimetype: "audio/mpeg"
		}, "audio")
	}
);

cmd({
		name: "tts",
		fromMe: isPublic,
		category: "converter",
		desc: "text to speech"
	},
	async ({
		m,
		client,
		args
	}) => {
		if (!args) {
			m.reply('ᴇɴᴛᴇʀ Qᴜᴇʀʏ!')
		} else {
			let [txt,
				lang
			] = args.split`:`
			const audio = googleTTS.getAudioUrl(`${txt}`, {
				lang: lang || "ml",
				slow: false,
				host: "https://translate.google.com",
			})
			client.sendMessage(m.jid, {
				audio: {
					url: audio,
				},
				mimetype: 'audio/mpeg',
				ptt: true,
				fileName: `${'tts'}.mp3`,
			}, {
				quoted: m,
			})

		}
	});
