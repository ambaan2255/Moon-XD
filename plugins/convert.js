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
		category: "converter",
		desc: lang.STICKER_DESC
	},
	async ({
		m,
		args
	}) => {
		if (!m.quoted || !(m.quoted.message.imageMessage || m.quoted.message.videoMessage)) {
			return await m.reply("ʀᴇᴩʟᴀʏ ᴛᴏ ᴀ ᴩʜᴏᴛᴏ ᴏʀ ᴠɪᴅᴇᴏ");
		}
		await m.react('⏫');
		await m.sendMsg(m.jid, await m.quoted.download(), {
			packName: args.split(';')[0] || config.STICKER_DATA.split(';')[0],
			authorName: args.split(';')[1] || config.STICKER_DATA.split(';')[1],
			quoted: m
		}, "sticker");
		return await m.react('✅');
	});

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
			return await m.reply("Reply to voice or video!");
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
