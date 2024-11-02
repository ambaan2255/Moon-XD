const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const util = require("util");
const axios = require("axios");
const fetch = require("node-fetch");
const fs = require("fs");

const {
	exec
} = require("child_process");
const {
	AddMp3Meta,
	getBuffer,
	getJson
} = require("../lib/functions.js");


cmd({
	name: "eval",
	fromMe: true,
	category: "sudo",
	desc: "Runs a server code"
}, async ({}) => {})

cmd({
		name: "restart",
		fromMe: true,
		desc: "Restart the bot",
		category: "sudo",
	},
	async ({
		m,
		args,
		client
	}) => {
		await m.reply("Restarting...");
		exec("node index.js", (error, stdout, stderr) => {
			if (error) {
				return client.sendMessage(m.jid, `Error: ${error}`);
			}
			return;
		});
	});

cmd({
		on: "text",
		fromMe: true,
	},
	async ({
		client,
		m,
		args
	}) => {
		if (args.startsWith("$")) {
			try {
				let evaled = await eval(`(async () => { ${args.replace("$", "")} })()`);
				if (typeof evaled !== "string") evaled = util.inspect(evaled);
				await m.reply(`${evaled}`)
			} catch (err) {
				await m.reply(`${util.format(err)}`);
			}
		}
	});
