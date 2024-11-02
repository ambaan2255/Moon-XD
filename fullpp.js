const {
	cmd,
	isPublic
} = require("../lib/plugins.js");
const Jimp = require("jimp");


cmd({
	name: "fullpp",
	fromMe: true,
	category: "sudo",
	desc: "fullpp"
}, async ({
	m,
	client,
	args
}) => {
	try {
		if (!m.quoted || (!m.quoted.message.imageMessage))
			return m.reply("Reply to an Image!");
		let media = await m.quoted.download();
		await updateProfilePicture(m.user, media, client);
		return await m.reply("Profile Picture Updated ✓");
	} catch (e) {
		console.log(e)
	}
})

async function updateProfilePicture(jid, imag, client) {
	const {
		query
	} = client;
	const {
		img
	} = await generateProfilePicture(imag);
	await query({
		tag: "iq",
		attrs: {
			to: "@s.whatsapp.net",
			type: "set",
			xmlns: "w:profile:picture",
		},
		content: [{
			tag: "picture",
			attrs: {
				type: "image"
			},
			content: img,
		}, ],
	});
}

async function generateProfilePicture(buffer) {
	const jimp = await Jimp.read(buffer);
	const min = jimp.getWidth();
	const max = jimp.getHeight();
	const cropped = jimp.crop(0,
		0,
		min,
		max);
	return {
		img: await cropped.scaleToFit(324,
			720).getBufferAsync(Jimp.MIME_JPEG),
		preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
	};
}
