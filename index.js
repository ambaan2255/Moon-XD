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
const P = require('pino');
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
			let str = `\n _X-HUB STSRTED_ \n\n\n✰ VERSION    : ${require("./package.json").version } \n✰ PLUGINS   : ${require("./lib/plugins").commands.length}`;
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
