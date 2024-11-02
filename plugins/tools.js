const {
	cmd,
	isPublic
} = require("../lib/plugins.js");
const acrcloud = require('acrcloud');
const acr = new acrcloud({
	host: 'identify-eu-west-1.acrcloud.com',
	access_key: 'ff489a0160188cf5f0750eaf486eee74',
	access_secret: 'ytu3AdkCu7fkRVuENhXxs9jsOW4YJtDXimAWMpJp'
});
const fs = require('fs')
const {
	tmpdir
} = require("os");
const {
	toVideo,
	imgurUpload
} = require("../lib/functions.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


cmd({
		name: "url",
		fromMe: true,
		category: "tools",
		desc: "upload media to imgur and returns Url"
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!m.quoted) {
			return m.reply('Reply to an Image/Video/Audio!');
		}

		let buff = await m.quoted.download()

		if (buff.length > 10 * 1024 * 1024)
			return m.reply('Reply with Filesize under 10 MegaBytes!');

		let loading = await m.sendMsg(m.jid, "...")

		let {
			data,
			mime
		} = await m.getFile(buff);

		const size = (data.length / (1024 * 1024)).toFixed(2);

		let tmpInput;

		if (mime.includes('audio')) {
			const aud = await toVideo(buff);
			const tmpInput = `${tmpdir()}/imgur.mp4`
			fs.writeFileSync(tmpInput, aud)
		} else {
			tmpInput = `${tmpdir()}/imgur.${mime.split("/")[1]}`
			fs.writeFileSync(tmpInput, data)
		}

		await sleep(2000)

		try {
			const link = await imgurUpload(tmpInput);
			m.sendMsg(m.jid, `Url: ${link}\nSize: ${size}`, {
				edit: loading.key
			})
		} catch {
			m.sendMsg(m.jid, `Error`, {
				edit: loading.key
			})
		}

	})

cmd({
		name: "find",
		fromMe: isPublic,
		category: "tools",
		desc: "Finds music from replied Audio"
	},
	async ({
		m,
		client
	}) => {
		try {
			if (!m.quoted || !(m.quoted.message.audioMessage || m.quoted.message.videoMessage)) {
				return m.reply("Reply to Audio/Video Message!");
			}
			let mes = await client.sendMessage(m.jid, {
				text: `...`
			})
			let buff = await m.quoted.download();
			let result = await acr.identify(buff);
			let {
				title,
				artists,
				album,
				genres,
				release_date,
				duration_ms,
				external_metadata
			} = result.metadata.music[0]
			let rez = `Title : ${title}\n${album.name ? `Album : ${album.name}\n`: ''}${artists[0]?.name ? `Artists : ${artists[0]?.name.split('/').join(', ')}\n`: ''}${genres ? `Genre : ${genres?.map(genre => genre?.name).join(', ')}\n`: ''}${duration_ms ? `Duration : ${duration_ms / 1000 + 's'}\n`: ''}${release_date ? `Release Date : ${release_date}\n`: ''}${external_metadata.spotify ? `Spotify : https://open.spotify.com/track/${external_metadata.spotify?.track.id}\n`: ''}${external_metadata.youtube ? `Youtube : https://youtu.be/${external_metadata.youtube.vid}_\n`: ''}`
			return await client.sendMessage(m.jid, {
				text: rez,
				edit: mes.key
			})
		} catch (e) {
			return await client.sendMessage(m.jid, {
				text: "Couldn't find a match !",
				edit: mes.key
			});
		}
	})


cmd({
		name: "vo",
		fromMe: isPublic,
		category: "tools",
		desc: "Resends the view Once message"
	},
	async ({
		m,
		client
	}) => {
		try {
			if (!m.quoted) {
				return m.reply("Reply to ViewOnce Message!");
			}
			if (m.quoted.message.viewOnceMessageV2) {
				let vv = m.quoted.message.viewOnceMessageV2

				if (vv.message.imageMessage) {
					let img = await m.downloadAndSaveMedia(vv.message.imageMessage, "vo", true)

					await client.sendMessage(m.jid, {
						image: {
							url: img
						},
						caption: vv.message.imageMessage.caption
					}, {
						quoted: m
					})
				} else if (vv.message.videoMessage) {

					let video = await m.downloadAndSaveMedia(vv.message.videoMessage, "vo", true)

					await client.sendMessage(m.jid, {
						video: {
							url: video
						},
						caption: vv.message.videoMessage.caption
					}, {
						quoted: m
					})

				}
			} else if (m.quoted.message.viewOnceMessageV2Extension.message.audioMessage) {
				let audio = await m.downloadAndSaveMedia(m.quoted.message.viewOnceMessageV2Extension.message.audioMessage, "vo", true)

				await client.sendMessage(m.jid, {
					audio: {
						url: audio
					}
				}, {
					quoted: m
				})
			} else {
				m.reply('Not a ViewOnce Message!')
			}
		} catch {
			m.reply("Error!")
		}
	})
