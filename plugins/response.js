const {
	cmd,
	isPublic
} = require("../lib/plugins.js");
const fetch = require('node-fetch')
const axios = require('axios');
const {
	SUDO
} = require('../config.js');
const {
	AddMp3Meta,
	toAudio,
	getJson
} = require("../lib/functions.js");

cmd({
		on: "text",
		fromMe: isPublic,
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!m.quoted) return;
		try {
			if (client.user.id.split(':')[0] === m.quoted.sender.split('@')[0] && !parseInt(m.text)) {}
		} catch (e) {
			console.log(e)
		}
	})

cmd({
		on: "text",
		fromMe: isPublic,
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!m.quoted) return;
		try {
			if (client.user.id.split(':')[0] === m.quoted.sender.split('@')[0] && parseInt(m.text)) {
				const number = parseInt(m.text);

				if (number >= 1 && number <= 11) {

					if (m.quoted.text.includes("Youtube Downloader")) {
						const lines = m.quoted.text.split('\n');
						const query = lines[number + 1].split(' .')[1].trim();
						let mes = await client.sendMessage(m.jid, {
							text: `...`
						}, {
							quoted: m
						})
						let response = await getJson(`https://viper.xasena.me/api/v1/yta?query=${query}`);
						await client.sendMessage(m.jid, {
							text: `Select Type\n\nTitle: ${response.data.title}\nUrl: ${response.data.url}\n\n1 .Audio\n2 .Video\n\nReply with Number`,
							edit: mes.key
						}, {
							quoted: m
						})
					}
					if (m.quoted.text.includes("Select Type")) {
						const lines = m.quoted.text.split('\n');
						const selectedPart = lines[number + 4];
						const query = selectedPart.trim().replace(/^\d+\s*\./, '');
						const urlRegex = /Url: (https?:\/\/[^\s]+)/;
						const match = m.quoted.text.match(urlRegex);
						const url = match && match[1];
						let mes = await client.sendMessage(m.jid, {
							text: `...`
						}, {
							quoted: m
						})
						let response = await getJson(`https://viper.xasena.me/api/v1/yta?query=${query}`);
						if (query.includes("Audio")) {
							let coverBuffer = await (await fetch(`${response.data.thumbnail}`)).buffer()
							let songbuff = await (await fetch(`${response.data.downloadUrl}`)).buffer()
							await client.sendMessage(m.jid, {
								text: `Downloading : ${response.data.title}`,
								edit: mes.key
							}, {
								quoted: m
							})
							const song = await AddMp3Meta(songbuff, coverBuffer, {
								title: response.data.title,
								artist: response.data.channel.name
							})
							return client.sendMessage(m.jid, {
								audio: song,
								mimetype: 'audio/mpeg'
							}, {
								quoted: m
							})
						}
						if (query.includes("Video")) {
							await client.sendMessage(m.jid, {
								text: `Downloading : ${response.data.title}`,
								edit: mes.key
							}, {
								quoted: m
							})
							let vidbuff = await (await fetch(`https://api-viper-x.koyeb.app/api/ytdl?video360p=${response.data.url}`)).buffer()
							m.sendMsg(m.jid, vidbuff, {}, "video")
						}
					}

				} else {
					return;
				}
				if (m.quoted.text.includes("Total Stories")) {

					const urlRegex = /Url : (.+)/;
					const match = m.quoted.text.match(urlRegex);

					if (match && match[1]) {

						const url = match[1].trim();

						let mes = await client.sendMessage(m.jid, {
							text: `Downloading ${number}th story`
						}, {
							quoted: m
						});

						try {
							let response = await getJson(`https://viper.xasena.me/api/insta?url=${url}`);
							m.sendMsg(m.jid, response.data[number - 1].url, {}, response.data[number - 1].type);
						} catch (error) {
							console.error("Error fetching data:", error);
							m.sendMsg(m.jid, "Error fetching data.", {
								quoted: m
							});
						}
					} else {
						m.sendMsg(m.jid, "No URL found in the text.", {
							quoted: m
						});
					}
				}
			}
		} catch {}

	})

cmd({
		on: "text",
		fromMe: isPublic
	},
	async ({
		m,
		client,
		args
	}) => {
		if (m.isGroup || !m.quoted) return;
		let text = [
			"sent",
			"send",
			"giv",
			"snt",
			"geb",
			"sev",
			"gev",
			"tha",
			"snd",
			"ayakk",
			"save",
			"znd",
			"znt"
		]
		for (any in text)
			if (args.toLowerCase().startsWith(text[any]))
				return await m.forward(m.jid, m.quoted)
	})

/*cmd({
    on: "text",
    fromMe: isPublic,
},
    async({
        m, client, args
    })=> {
        try {
            let sudo = SUDO.split(",")
            let audios = ["1https://api-viper-x.koyeb.app/api/song/download?id=SGQZzmLFOgg","https://api-viper-x.koyeb.app/api/song/download?id=NWgyvA4AN5M"]

            for (any in sudo)
                if (args.includes(sudo[any])) {

                const audio = await audios[Math.floor(Math.random() * audios.length)]
                const aud = await (await fetch(audio)).buffer();
                let image1 = await (await fetch('https://avatars.githubusercontent.com/u/88338865?v=4')).buffer();
                var res = await toAudio(aud, 'mp4')
                return await client.sendMessage(m.jid, {
                    audio: res,
                    mimetype: 'audio/mpeg',
                    ptt: true,
                    waveform: [00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00, 99, 00],
                    contextInfo: {
                        externalAdReply: {
                            title: "           バイパー💗",
                            body: "         ",
                            mediaType: 2,
                            thumbnail: image1,
                            mediaUrl: '',
                            sourceUrl: '',
                            showAdAttribution: true
                        }
                    }
                }, {
                    quoted: false
                })

            }
        } catch {
        }
    })*/
