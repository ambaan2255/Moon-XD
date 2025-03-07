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
let noprob = `ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ.`
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

		if (!args) return await m.reply("ᴇɴᴛᴇʀ ʟɪɴᴋ");
		let dl = await client.sendMessage(m.jid, {
			text: "ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ.."
		}, {
			quoted: m
		})
		try {
			let response = await getJson(`https://viper.xasena.me/api/v1/insta?query=${args}`);
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
				text: `ᴇʀʀᴏʀ!`,
				edit: dl.key
			})
		}
	}
);

cmd({
on: "text", fromMe: isPublic
},
async ({
m,
client,
args
}) => {
if (args.includes("https://www.instagram.com/reel/")) { 
	let dl = await client.sendMessage(m.jid, {
			text: "ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ.."
		}, {
			quoted: m
		})
try {
const res = await axios.get(`https://viper.xasena.me/api/v1/insta?query=${args}`)
let response = await res.data
for (let i of response.data) {
await m.sendMsg(m.jid, i.url, {quoted:m}, i.type)
}
	 await client.sendMessage(m.jid, {
			text: "ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ.",
		        edit: dl.key
		}, {
			quoted: m
		})
} catch (e) {
console.log(e)
}
}
});

cmd({
		name: "igstory1",
		fromMe: isPublic,
		desc: "Instagram story downloader",
		category: "downloader",
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!args) return await m.reply("ᴇɴᴛᴇʀ ʟɪɴᴋ");
		let dl = await client.sendMessage(m.jid, {
			text: "ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ.."
		}, {
			quoted: m
		})

		let url = args
		let response = await getJson(`https://viper.xasena.me/api/v1/insta?query=${args}`);
		let data = response.data[0]
		let datai = `Total Stories\nUrl : ${url}\n\n`
		for (let i = 1; i < response.data.length + 1; i++) {
			datai += `${i} . ${i}/${response.data.length} - ${response.data[i-1].type}\n`
		}
		datai += '\n ʀᴇᴩʟᴀʏ ᴀ ɴᴜᴍᴇʀ'
		m.sendMsg(m.jid, datai, {
			edit: dl.key
		})
	}
);

cmd({
		name: "igstory2",
		fromMe: isPublic,
		desc: "Instagram story downloader",
		category: "downloader",
	},
	async ({
		m,
		client,
		args
E> {

		if (!args) return await m.reply("ᴇɴᴛᴇʀ ᴜꜱᴇʀ ɴᴀᴍᴇ");
		let dl = await client.sendMessage(m.jid, {
			text: "ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ"
		}, {
			quoted: m
		})
		try{
const { default: axios } = require("axios");
let data = await axios.get(`https://api.devstackx.in/v1/igstory/username?id=${args}`);
for (let i of data.data.data) {
 await  m.sendMsg(m.jid, i.url,{ quoted: m }, i.type);
}
		await client.sendMessage(m.jid,{text: `ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ`, edit: dl.key})
			}	catch (e) {
			 client.sendMessage(m.jid, {
				text: `ᴇʀʀᴏʀ!`,
				edit: dl.key})
			}}
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
			if (!args) return await m.reply("ᴇɴᴛᴇʀ ɴᴀᴍᴇ,ɴᴜᴍʙᴇʀ!");
			let dl= await client.sendMessage(m.jid,{text: `ꜱᴇᴀʀᴄʜɪɴɢ ɪᴍᴀɢᴇꜱ`},{quoted: m})
			let [query,
				amount
			] = args.split(",");
			let result = await gimage(query, amount);
		await client.sendMessage(m.jid, {
				text: `ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ`,
				edit: dl.key
			})
			for (let i of result) {
				await m.sendMsg(m.jid, i, {}, "image")
				 }
				let jd = await client.sendMessage(m.jid,{text: `ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ.`},{quoted: m})
			await client.sendMessage(m.jid,{text: `ʜᴇʀᴇ ʏᴏᴜʀ ɪᴍᴀɢᴇꜱ`,edit: jd.key})
			}	catch (e) {
			client.sendMessage(m.jid, {
				text: `ᴇʀʀᴏʀ`,
				edit: dl.key
			})
			}
	})
