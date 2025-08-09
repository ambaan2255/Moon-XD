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
cmd({
	  name: "kick",
	  fromMe: isPublic,
	  desc: "Kick a user from the group",
	  category: "group"
},
		async ({m, client, args}) => {
			try {
				if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.")
				if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")
				if (!(args || m.quoted)) return m.reply("Mention a User")
				if (args) {
			    var user = args.replace("@", "") + '@s.whatsapp.net';
				} else if (m.quoted.sender) {
					var user = m.quoted.sender;
				} else if (m.mentionedJid) {
					var user = args + '@s.whatsapp.net';
				}

				await client.groupParticipantsUpdate(m.jid, [user], "remove");
				m.sendMsg(m.jid, `@${user.split("@") [0]} kicked from the group.`, { 
					mentions: [user],
					quoted: m		
				})
			} catch (e) {
			console.log(e);
		}

	})
	  
cmd({
	  name: "add",
	  fromMe: isPublic,
	  desc: "Add a user to the group",
	  category: "group"
},
		async ({m, client, args}) => {
			try {
				if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.");
				if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")
				if (!(args || m.quoted)) return m.reply("Mention a user")
				if (args) {
					var user = args.replace("@", "") + '@s.whatsapp.net';
				} else if (m.quoted.sender) {
					var user = m.quoted.sender;
				} else if (m.mentionedJid) {
					var user = args + '@s.whatsapp.net';
				}

				await client.groupParticipantsUpdate(m.jid, [user],"add");
				m.sendMsg(m.jid,`@${user.split("@")[0]} added to the group.`,{
					mentions: [user],
					quoted: m
				})
				} catch (e) {
			console.log(e);
		}

	})

cmd({
	  name: "tagall",
	  fromMe: isPublic,
	  desc: "Tags all members in the group",
	  category: "group"
},
		async ({m, client, match}) => {
		if (!m.isGroup) return
    const { participants } = await client.groupMetadata(m.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    m.sendMsg(m.jid,teks,{
      mentions: participants.map((a) => a.id),
    });
  }
);	
