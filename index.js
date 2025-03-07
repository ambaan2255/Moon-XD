const {
	makeWASocket,
	useMultiFileAuthState,
	DisconnectReason,
	Browsers,
	fetchLatestBaileysVersion,
	getAggregateVotesInPollMessage,
	makeInMemoryStore,
	jidNormalizedUser,
	makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const {whatsappAutomation, callAutomation} = require('./lib/statusView.js');
const P = require('pino');
const { serialize } = require('./lib/serialize.js');
const {
	commands
} = require("../lib/plugins.js");
const path = require('path');
const web = require('./server')
const fs = require('fs');
const MsgHandler = require('./lib/message.js')
const cron = require('node-cron');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const config = require("./config");
const Spinnies = require("spinnies")
const spinnies = new Spinnies({
	spinner: {
		interval: 200,
		frames: [" ", "👾"],
	}
})


async function Bot() {

		
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState(
		"./session"
	);
	const { version } = await fetchLatestBaileysVersion();
	/////////////////////////////////////////////

	const client = makeWASocket({
		auth: state,
		browser: Browsers.macOS('Desktop'),
		downloadHistory: false,
		syncFullHistory: false,
		logger: P({
			level: "silent"
		}),
		printQRInTerminal: true,
		version
	})

	//const client = new Client(connect)

	/////////////////////////////////////////////
	/*
    const store = makeInMemoryStore({
        logger: P().child({
            level: 'silent', stream: 'store'
        })
    })

    store.bind(client.ev);

    setInterval(() => {

        store.writeToFile("./database/store.json");

    }, 30 * 1000);
*/
	/////////////////////////////////////////////

	client.ev.on('connection.update', async(update) => {
		const {
			connection,
			lastDisconnect
		} = update;
		if (connection === "connecting") {
			console.log("ᴄᴏɴɴᴇᴄᴛɪɴɢ ...");
		}
		if (connection === "open") {
			console.log("ᴄᴏɴɴᴇᴄᴛᴇᴅ");
			config.DATABASE.sync();
			console.log("Connecting to database...");
			fs.readdirSync("./plugins").forEach((plugin) => {
				if (path.extname(plugin).toLowerCase() == ".js") {
					require("./plugins/" + plugin);
				}
			});
			console.log("ᴘʟᴜɢɪɴs ʟᴏᴀᴅᴇᴅ");
			console.log("\n======[  ☞︎︎︎  ʟᴏɢs  ☜︎︎︎   ]======\n");
			let str = `ʙᴏᴛ ꜱᴛᴀʀᴛᴇᴅ🗿`;
      client.sendMessage(client.user.id, {  text: str })
	web()
			
		}

		if (connection === 'close') {
			if (
				lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
			) {
				console.log("Reconnecting...");
				Bot()
			} else {
				console.log("Connection closed. Device logged out.");
				await delay(3000);
				process.exit(0);
			}
		}

	})

	client.ev.on('messages.upsert', async (msg) => {
	let m;
	
	try {
		m = await serialize(JSON.parse(JSON.stringify(msg.messages[0])), client);
	} catch (error) {
		console.error("Error serializing message:", error);
		return;
	}
	
	await whatsappAutomation(client, m, msg);
	
	if(config.DISABLE_PM && !m.isGroup) {
		return;
	}
	
	commands.map(async (Sparky) => {
		if (Sparky.fromMe && !m.sudo) return;
		let comman = m.text ? m.body[0].toLowerCase() + m.body.slice(1).trim() : "";
		let args;
		try {
			if (Sparky.on) {
				Sparky.function({m, args: m.body, client});
			} else if (Sparky.name && Sparky.name.test(comman)) {
				args = m.body.replace(Sparky.name, '$1').trim();
				Sparky.function({m, args, client});
			}
		} catch (error) {
			console.log(error);
		}
	});
});

    //////////////////////////////////////


	/////////////////////////////////////////////

	client.ev.on("creds.update",
		saveCreds);

	

	/////////////////////////////////////////////
	/*
	    client.ev.on("contacts.update",
	        (update) => {
	            for (let contact of update) {
	                let id = jidNormalizedUser(contact.id)
	                if (store && store.contacts) store.contacts[id] = {
	                    ...(store.contacts?.[id] || {}),
	                    ...(contact || {})
	                }
	            }
	        })
	*/
	/////////////////////////////////////////////
	/*
	    client.ev.on("contacts.upsert",
	        (update) => {
	            for (let contact of update) {
	                let id = jidNormalizedUser(contact.id)
	                if (store && store.contacts) store.contacts[id] = {
	                    ...(contact || {}),
	                    isContact: true
	                }
	            }
	        })
	*/
	/////////////////////////////////////////////

	client.ev.on('messages.upsert',
		async (message) => {
			await MsgHandler(client, message)
		})

	/////////////////////////////////////////////
}


Bot()

process.on('uncaughtException', function(err) {
	let e = String(err)
	if (e.includes("Socket connection timeout")) return
	if (e.includes("item-not-found")) return
	if (e.includes("rate-overlimit")) return
	if (e.includes("Connection Closed")) return
	if (e.includes("Timed Out")) return
	if (e.includes("Value not found")) return
	console.log('Caught exception: ', err)
})
