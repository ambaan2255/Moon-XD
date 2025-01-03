const axios = require('axios');
const express = require('express');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8080;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let i = 0;

async function web() {
	console.log("web Starting...");
	app.get('/', function(req, res) {
		res.send({
			status: "Active"
		});
	});
	const server = http.createServer(app);
	server.listen(PORT, async() => {
		console.log('Connected to Server -- ', PORT);
		while (true) {
			i++;
			try {
				let response = await axios("https://newa1.onrender.com")
				console.log("ᴄ ᴏ ɴ ɴ ᴇ ᴄ ᴛ ᴇ ᴅ  ᴛ ᴏ  s ᴇ ʀ ᴠ ᴇ ʀ  ✓ : ", response.status)
				await sleep(40000)
			} catch {
				console.log("Retrying...")
			}
		}
	});
}

module.exports = web
