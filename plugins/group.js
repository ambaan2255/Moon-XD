const {
	cmd,
	commands,
	isPublic
} = require("../lib/plugins.js");
const font = require("@viper-x/fancytext");

cmd({
		name: "tag",
		fromMe: isPublic,
		desc: "Tags a content",
		category: "group"
	},
	async ({
		m,
		client,
		args
	}) => {
		arg = args || m.quoted
		if (!arg) return m.reply("ʀᴇᴩʟᴀʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ");
		if (!await m.isAdmin(m.sender)) return m.reply("(ᴛᴀɢ)ᴩᴇʀᴍɪꜱꜱɪᴏɴ ᴏɴʟʏ ꜰᴏʀ ᴀᴅᴍɪɴꜱ.");
		const {
			participants
		} = await client.groupMetadata(m.jid);
		let jids = await participants.map((a) => a.id)
		m.forward(m.jid, arg, {
			contextInfo: {
				mentionedJid: jids
			}
		});
	}
);


cmd({
		name: "invite",
		fromMe: isPublic,
		desc: "Share's Group invitation link",
		category: "group"
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!await m.isAdmin(client.user.id)) return m.reply("ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.")
		if (!await m.isAdmin(m.sender)) return m.reply("ᴩᴇʀᴍɪꜱꜱɪᴏɴ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴꜱ.")
		let code = await client.groupInviteCode(m.jid)
		return m.reply('https://chat.whatsapp.com/' + code)
	})

cmd({
		name: "mute",
		fromMe: isPublic,
		desc: "Mutes the group.",
		category: "group"
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!await m.isAdmin(client.user.id)) return m.reply("ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.")
		if (!await m.isAdmin(m.sender)) return m.reply("ᴩᴇʀᴍɪꜱꜱɪᴏɴ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴꜱ.")
		await client.groupSettingUpdate(m.jid, 'announcement');
		return await m.reply("ɢʀᴏᴜᴩ ᴄʜᴀɴɢᴇᴅ ᴛᴏ ᴀᴅᴍɪɴꜱ ᴏɴʟʏ!.");
	})

cmd({
		name: "unmute",
		fromMe: isPublic,
		desc: "Unmutes the group",
		category: "group"
	},
	async ({
		m,
		client,
		args
	}) => {

		if (!await m.isAdmin(client.user.id)) return m.reply("ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.")
		if (!await m.isAdmin(m.sender)) return m.reply("ᴩᴇʀᴍɪꜱꜱɪᴏɴ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴꜱ.")
		await client.groupSettingUpdate(m.jid, 'not_announcement');
		return await m.reply("ɢʀᴏᴜᴩ ᴄʜᴀɴɢᴇᴅ ᴛᴏ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ.");
	})

cmd({
		name: "promote",
		fromMe: isPublic,
		desc: "Promotes a user to admin",
		category: "group"
	},
	async ({
		m,
		client,
		args
	}) => {
		try {
			if (!await m.isAdmin(client.user.id)) return m.reply("ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.")
			if (!await m.isAdmin(m.sender)) return m.reply("ᴩᴇʀᴍɪꜱꜱɪᴏɴ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴꜱ.")

			if (!(args || m.quoted)) return m.reply("ᴍᴇɴᴛɪᴏɴ ᴀ ᴜꜱᴇʀ.")
			if (args) {
				var user = args.replace("@", "") + '@s.whatsapp.net';
			} else if (m.quoted.sender) {
				var user = m.quoted.sender;
			} else if (m.mentionedJid) {
				var user = args + '@s.whatsapp.net';
			}

			if (await m.isAdmin(user) === true) return m.reply("ᴛʜɪꜱ ᴜꜱᴇʀ ɪꜱ ᴄᴜʀʀᴇɴᴛʟʏ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.");

			await client.groupParticipantsUpdate(m.jid, [user], "promote");
			m.sendMsg(m.jid, `@${user.split("@")[0]} ᴩʀᴏᴍᴏᴛᴇᴅ ᴛᴏ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ`, {
				mentions: [user],
				quoted: m
			})
		} catch (e) {
			console.log(e);
		}

	})

cmd({
		name: "demote",
		fromMe: isPublic,
		desc: "Demotes a user from admin",
		category: "group"
	},
	async ({
		m,
		client,
		args
	}) => {
		try {

			if (!await m.isAdmin(client.user.id)) return m.reply("ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.")
			if (!await m.isAdmin(m.sender)) return m.reply("ᴩᴇʀᴍɪꜱꜱɪᴏɴ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴꜱ.")
			if (!(args || m.quoted)) return m.reply("ᴍᴇɴᴛɪᴏɴ ᴀ ᴜꜱᴇʀ.")
			if (args) {
				var user = args.replace("@", "") + '@s.whatsapp.net';
			} else if (m.quoted.sender) {
				var user = m.quoted.sender;
			} else if (m.mentionedJid) {
				var user = args + '@s.whatsapp.net';
			}

			if (!await m.isAdmin(user)) return m.reply("ᴛʜɪꜱ ᴜꜱᴇʀ ɪꜱ ᴄᴜʀʀᴇɴᴛʟʏ ɴᴏᴛ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴ.");

			await client.groupParticipantsUpdate(m.jid, [user], "demote");
			m.sendMsg(m.jid, `@${user.split("@")[0]} ᴅᴇᴍᴏᴛᴇᴅ ꜰʀᴏᴍ ᴀᴅᴍɪɴ ʀᴏʟᴇ.`, {
				mentions: [user],
				quoted: m
			})

		} catch (e) {
			console.log(e);
		}

	})
