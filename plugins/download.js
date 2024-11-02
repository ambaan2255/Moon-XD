const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
let gis = require("g-i-s");
const axios = require('axios');
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const {
	getJson 
} = require("../lib/functions.js");
let noprob = `Downloading...`
cmd({
		name: "insta",
		fromMe: isPublic,
		desc: "Instagram downloader",
		category: "downloader",
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!args) return await m.reply("Enter Link!");
		let dl = await client.sendMessage(m.jid, {
			text: "..."
		}, {
			quoted: m
		})
		try {
			let response = await getJson(`https://viper.devstackx.in/api/insta?url=${args}`);
			await client.sendMessage(m.jid, {
				text: `${noprob}`,
				edit: dl.key
			})
			for (let i of response.data) {
				await m.sendMsg(m.jid, i.url, {
					quoted: m
				}, i.type)
			}
		} catch (e) {
			client.sendMessage(m.jid, {
				text: `Error!`,
				edit: dl.key
			})
		}
	}
);

cmd({
		name: "igstory",
		fromMe: isPublic,
		desc: "Instagram story downloader",
		category: "downloader",
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!args) return await m.reply("Enter Link!");
		let dl = await client.sendMessage(m.jid, {
			text: "..."
		}, {
			quoted: m
		})

		let url = args
		let response = await getJson(`https://viper.devstackx.in/api/insta?url=${args}`);
		let data = response.data[0]
		let datai = `Total Stories\nUrl : ${url}\n\n`
		for (let i = 1; i < response.data.length + 1; i++) {
			datai += `${i} . ${i}/${response.data.length} - ${response.data[i-1].type}\n`
		}
		datai += '\nReply with Number'
		m.sendMsg(m.jid, datai, {
			edit: dl.key
		})
	}
);

cmd({
		name: "img",
		fromMe: isPublic,
		desc: "Google Image search",
		category: "downloader",
	},
	async ({
		m,
		client,
		args
	}) => {
		try {
			async function gimage(query, amount = 5) {
				let list = [];
				return new Promise((resolve, reject) => {
					gis(query, async (error, result) => {
						for (
							var i = 0; i < (result.length < amount ? result.length : amount); i++
						) {
							list.push(result[i].url);
							resolve(list);
						}
					});
				});
			}
			if (!args) return await m.reply("Enter Query,Number!");
			let [query,
				amount
			] = args.split(",");
			let result = await gimage(query, amount);
			await m.reply(
				`...`
				//`Downloading ${amount || 1} images for ${query}`
			);
			for (let i of result) {
				await m.sendMsg(m.jid, i, {}, "image")
			}

		} catch (e) {
			console.log(e)
		}
	}
);
