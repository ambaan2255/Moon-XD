const ID3Writer = require("browser-id3-writer");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
	fromBuffer
} = require('file-type');
const axios = require("axios");
const {
	spawn
} = require("child_process");
const {
	tmpdir
} = require("os");
const ff = require("fluent-ffmpeg");
const webp = require("node-webpmux");
const {
	generateWAMessageFromContent,
	proto
} = require("@whiskeysockets/baileys");
const {
	ImgurClient
} = require('imgur');


const genAI = new GoogleGenerativeAI("AIzaSyCmjfYu0l9J8Ynh7xh0ax7v5a23tTGC9gg");

function fileToGenerativePart(buff, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(buff).toString("base64"),
      mimeType,
    },
  };
}

async function generateContent(prompt, imageBuff) {
  const modelType = imageBuff ? "gemini-pro-vision" : "gemini-pro";
  const model = genAI.getGenerativeModel({ model: modelType });
  const result = await model.generateContent([
    prompt,
    fileToGenerativePart(
      imageBuff,
      imageBuff && (await fromBuffer(imageBuff)).mime
    ),
  ]);

  return result.response.text();
}

async function gemini(prompt, imageBuff, options) {
  const { promptText, promptImage } = await getJson(
    `https://gist.githubusercontent.com/Viper-x0/4d269d11905ed3c096841caa0581e45e/raw/413c829c01040ee42a267476e7034f30a56d1701/gistfile1.txt`
  );

  try {
    if (imageBuff) {
      prompt = promptImage + prompt;
      return await generateContent(prompt, imageBuff);
    } else {
      prompt = promptText + prompt;
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    }
  } catch (error) {
    return error.message.replace("[GoogleGenerativeAI Error]:", "");
  }
}

async function getBuffer(url, options = {}) {
	try {
		const res = await axios({
			method: "get",
			url,
			headers: {
				DNT: 1,
				"Upgrade-Insecure-Request": 1,
				'accept': '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
				'sec-ch-ua-mobile': '?0',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"origin": "https://www.y2mate.com",
				"referer": "https://www.y2mate.com/en948",
				"cookie": "cf_clearance=A4Anruq7fHl_NFlgQJjsjAepzjG.a3LF3yWXZgGnUvE-1723828943-1.0.1.1-jumUjSQd.SeWQcCnDXh4VDzjNmmYRuy1LolCrulMYBYm6cZtTeHfJJQBupWQEHSpKNA2w8yABjdsr3lqjAlW3Q"
			},
			...options,
			responseType: "arraybuffer",
		});
		return res.data;
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
}

async function getJson(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "GET",
      url: url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    return err;
  }
}

async function imgurUpload(path) {
	try {
		const client = new ImgurClient({
			clientId: "a0113354926015a"
		});
		const response = await client.upload({
			image: fs.createReadStream(path),
			type: 'stream',
		});
		let url = response.data.link;
		return url;
	} catch (error) {
		console.error('Error: ',
			error);
		throw error;
	}
}

async function imageToWebp(media) {
	const tmpFileOut = path.join(
		tmpdir(),
		`sticker.webp`
	);
	const tmpFileIn = path.join(
		tmpdir(),
		`sticker.jpg`
	);

	fs.writeFileSync(tmpFileIn, media);

	await new Promise((resolve, reject) => {
		ff(tmpFileIn)
			.on("error", reject)
			.on("end", () => resolve(true))
			.addOutputOptions([
				"-vcodec",
				"libwebp",
				"-vf",
				"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
			])
			.toFormat("webp")
			.save(tmpFileOut);
	});

	const buff = fs.readFileSync(tmpFileOut);
	fs.unlinkSync(tmpFileOut);
	fs.unlinkSync(tmpFileIn);
	return buff;
}

async function videoToWebp(media) {
	const tmpFileOut = path.join(
		tmpdir(),
		`sticker.webp`
	);
	const tmpFileIn = path.join(
		tmpdir(),
		`sticker.mp4`
	);

	fs.writeFileSync(tmpFileIn, media);

	await new Promise((resolve, reject) => {
		ff(tmpFileIn)
			.on("error", reject)
			.on("end", () => resolve(true))
			.addOutputOptions([
				"-vcodec",
				"libwebp",
				"-vf",
				"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
				"-loop",
				"0",
				"-ss",
				"00:00:00",
				"-t",
				"00:00:05",
				"-preset",
				"default",
				"-an",
				"-vsync",
				"0",
			])
			.toFormat("webp")
			.save(tmpFileOut);
	});

	const buff = fs.readFileSync(tmpFileOut);
	fs.unlinkSync(tmpFileOut);
	fs.unlinkSync(tmpFileIn);
	return buff;
}

async function writeExifImg(media, metadata) {
	let wMedia = await imageToWebp(media);
	const tmpFileIn = path.join(
		tmpdir(),
		`sticker.webp`
	);
	const tmpFileOut = path.join(
		tmpdir(),
		`sticker.webp`
	);
	fs.writeFileSync(tmpFileIn, wMedia);

	if (metadata.packname || metadata.author) {
		const img = new webp.Image();
		const json = {
			"sticker-pack-id": `https://github.com/Viper-X0`,
			"sticker-pack-name": metadata.packname,
			"sticker-pack-publisher": metadata.author,
			emojis: metadata.categories ? metadata.categories : [""],
		};
		const exifAttr = Buffer.from([
			0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
			0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
		]);
		const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
		const exif = Buffer.concat([exifAttr, jsonBuff]);
		exif.writeUIntLE(jsonBuff.length, 14, 4);
		await img.load(tmpFileIn);
		fs.unlinkSync(tmpFileIn);
		img.exif = exif;
		await img.save(tmpFileOut);
		return tmpFileOut;
	}
}

async function writeExifVid(media, metadata) {
	let wMedia = await videoToWebp(media);
	const tmpFileIn = path.join(
		tmpdir(),
		`sticker.webp`
	);
	const tmpFileOut = path.join(
		tmpdir(),
		`sticker.webp`
	);
	fs.writeFileSync(tmpFileIn, wMedia);

	if (metadata.packname || metadata.author) {
		const img = new webp.Image();
		const json = {
			"sticker-pack-id": `https://github.com/Viper-X0`,
			"sticker-pack-name": metadata.packname,
			"sticker-pack-publisher": metadata.author,
			emojis: metadata.categories ? metadata.categories : [""],
		};
		const exifAttr = Buffer.from([
			0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
			0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
		]);
		const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
		const exif = Buffer.concat([exifAttr, jsonBuff]);
		exif.writeUIntLE(jsonBuff.length, 14, 4);
		await img.load(tmpFileIn);
		fs.unlinkSync(tmpFileIn);
		img.exif = exif;
		await img.save(tmpFileOut);
		return tmpFileOut;
	}
}

async function writeExifWebp(media, metadata) {
	const tmpFileIn = path.join(
		tmpdir(),
		`sticker.webp`
	);
	const tmpFileOut = path.join(
		tmpdir(),
		`sticker.webp`
	);
	fs.writeFileSync(tmpFileIn, media);

	if (metadata.packname || metadata.author) {
		const img = new webp.Image();
		const json = {
			"sticker-pack-id": `https://github.com/Viper-X0`,
			"sticker-pack-name": metadata.packname,
			"sticker-pack-publisher": metadata.author,
			emojis: metadata.categories ? metadata.categories : [""],
		};
		const exifAttr = await Buffer.from([
			0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
			0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
		]);
		const jsonBuff = await Buffer.from(JSON.stringify(json), "utf-8");
		const exif = await Buffer.concat([exifAttr, jsonBuff]);
		await exif.writeUIntLE(jsonBuff.length, 14, 4);
		await img.load(tmpFileIn);
		fs.unlinkSync(tmpFileIn);
		img.exif = exif;
		await img.save(tmpFileOut);
		return tmpFileOut;
	}
}

async function getBuffer(url, options) {
	try {
		options ? options : {};
		const res = await require("axios")({
			method: "get",
			url,
			headers: {
				DNT: 1,
				"Upgrade-Insecure-Request": 1,
			},
			...options,
			responseType: "arraybuffer",
		});
		return res.data;
	} catch (e) {
		console.log(`Error : ${e}`);
	}
}

async function AddMp3Meta(
	songbuffer,
	coverBuffer,
	options = {
		title: `Viper-x0 Whatsapp bot`,
		artist: ""
	}
) {
	/*if (!Buffer.isBuffer(songbuffer)) {
	    songbuffer = await getBuffer(songbuffer);
	}
	if (!Buffer.isBuffer(coverBuffer)) {
	    coverBuffer = await getBuffer(coverBuffer);
	}*/
	const audio = await toAudio(songbuffer, "mp3")
	const writer = new ID3Writer(audio);
	writer
		.setFrame("TIT2", options.title)
		.setFrame('TPE1', [`${options.artist}`])
		.setFrame('TALB', ' ')
		.setFrame('TYER', 2004)
		.setFrame('APIC', {
			type: 3,
			data: coverBuffer,
			description: 'Super picture'
		})
	writer.addTag();
	return Buffer.from(writer.arrayBuffer);
}

async function ffmpeg(buffer, args = [], ext = "", ext2 = "") {
	return new Promise(async (resolve, reject) => {
		try {
			let tmp = path.join(__dirname, "./tmp", +new Date() + "." + ext);
			let out = tmp + "." + ext2;
			await fs.promises.writeFile(tmp, buffer);
			spawn("ffmpeg", ["-y", "-i", tmp, ...args, out])
				.on("error", reject)
				.on("close", async (code) => {
					try {
						await fs.promises.unlink(tmp);
						if (code !== 0) return reject(code);
						resolve(await fs.promises.readFile(out));
						await fs.promises.unlink(out);
					} catch (e) {
						reject(e);
					}
				});
		} catch (e) {
			reject(e);
		}
	});
}

async function toAudio(buffer, ext) {
	return ffmpeg(
		buffer,
		["-vn", "-ac", "2", "-b:a", "128k", "-ar", "44100", "-f", "mp3"],
		ext,
		"mp3"
	);
}
async function toVideo(buffer) {
	return ffmpeg(
		buffer,
		['-filter_complex', 'color', '-pix_fmt', 'yuv420p', '-crf', '51', '-c:a', 'copy', '-shortest'],
		"mp3",
		"mp4"
	);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function createInteractiveMessage(jid, data, options = {}) {
	const {
		button,
		header,
		footer,
		body
	} = data;
	let buttons = [];
	for (let i = 0; i < button.length; i++) {
		let btn = button[i];
		let Button = {};
		Button.buttonParamsJson = JSON.stringify(btn.params);
		switch (btn.type) {
			case "copy":
				Button.name = "cta_copy";
				break;
			case "url":
				Button.name = "cta_url";
				break;
			case "location":
				Button.name = "send_location";
				break;
			case "address":
				Button.name = "address_message";
				break;
			case "call":
				Button.name = "cta_call";
				break;
			case "reply":
				Button.name = "quick_reply";
				break;
			case "list":
				Button.name = "single_select";
				break;
			default:
				Button.name = "quick_reply";
				break;
		}
		buttons.push(Button);
	}
	const mess = {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2,
				},
				interactiveMessage: proto.Message.InteractiveMessage.create({
					body: proto.Message.InteractiveMessage.Body.create({
						...body
					}),
					footer: proto.Message.InteractiveMessage.Footer.create({
						...footer
					}),
					header: proto.Message.InteractiveMessage.Header.create({
						...header
					}),
					nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
						buttons: buttons,
					}),
				}),
			},
		},
	};
	let optional = generateWAMessageFromContent(jid, mess, options);
	return optional;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ytdlget = async (url) => {
	return new Promise((resolve, reject) => {
		const data = {
			k_query: url,
			k_page: 'home',
			hl: 'en',
			q_auto: 0
		}
		  let config = {
			method: "post",
			url: "https://www.y2mate.com/mates/en948/analyzeV2/ajax",
			headers: {
				'accept': '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
				'sec-ch-ua-mobile': '?0',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"origin": "https://www.y2mate.com",
				"referer": "https://www.y2mate.com/en948",
				"cookie": "cf_clearance=A4Anruq7fHl_NFlgQJjsjAepzjG.a3LF3yWXZgGnUvE-1723828943-1.0.1.1-jumUjSQd.SeWQcCnDXh4VDzjNmmYRuy1LolCrulMYBYm6cZtTeHfJJQBupWQEHSpKNA2w8yABjdsr3lqjAlW3Q"
			},
			data
		  };

		axios
			.request(config)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

function formatYtdata(data, options) {
	const {
		type,
		quality
	} = options;
	const formatted_data = [];

	const processFormat = (format) => {
		const info = {
			vid: data.vid,
			id: format.k,
			size: format.size,
			quality: format.q,
			type: format.f,
		};
		formatted_data.push(info);
	};

	Object.values(data.links.mp4).forEach(processFormat);
	processFormat(data.links.mp3.mp3128);
	//processFormat(data.links["3gp"]["3gp@144p"]);
	let formatted = formatted_data;
	if (type) {
		formatted = formatted_data.filter((format) => format.type === type);
	}
	if (quality) {
		formatted = formatted_data.filter((format) => format.quality === quality);
	}
	return formatted;
}


const convert = async (vid , k) => {
  
	const data = {
		  vid,
		  k
	  }
	  let config = {
		  method: "post",
		  url: "https://www.y2mate.com/mates/convertV2/index",
		  headers: {
			  'accept': '*/*',
			  'accept-language': 'en-US,en;q=0.9',
			  'sec-fetch-mode': 'cors',
			  'sec-fetch-site': 'same-origin',
			  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
			  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			  "origin": "https://www.y2mate.com",
			  "referer": "https://www.y2mate.com/en948",
			  "cookie": "cf_clearance=A4Anruq7fHl_NFlgQJjsjAepzjG.a3LF3yWXZgGnUvE-1723828943-1.0.1.1-jumUjSQd.SeWQcCnDXh4VDzjNmmYRuy1LolCrulMYBYm6cZtTeHfJJQBupWQEHSpKNA2w8yABjdsr3lqjAlW3Q"
		  },
		  data
	  };
  
	  try {
		  const response = await axios.request(config);
		  return response.data;
	  } catch (error) {
		  console.error(error);
		  throw new Error("An error occurred during the request");
	  }
	
  };
  

async function yta(url) {
	const data = await ytdlget(url);
	const formatted_data = formatYtdata(data, {
		type: "mp3",
	});
	//console.log(formatted_data[0].size)
	const k = formatted_data[0].id;
	const vid = formatted_data[0].vid;
	let response = await convert(vid, k);
	//console.log(response)
	response = {
		...response,
		size: formatted_data[0].size,
		thumb: `https://i.ytimg.com/vi/${vid}/0.jpg`,
	};
	return response;
}

async function ytv(url) {
	const data = await ytdlget(url);
	const formatted_data = formatYtdata(data, {
		type: "mp4"
	});
	var res = [];
	for (const key in formatted_data) {
		if (formatted_data[key].quality === "auto") {
			delete formatted_data[key];
		}
	}
	for (const item in formatted_data) {
		let response = await convert(
			formatted_data[item].vid,
			formatted_data[item].id,
		);
		res.push({
			title: response.title,
			type: response.ftype,
			quality: response.fquality,
			sizes: formatted_data[item].size,
			thumb: `https://i.ytimg.com/vi/${formatted_data[item].vid}/0.jpg`,
			url: response.dlink,
		});
	}
	return res;
}

async function ytdlx(url) {
	const data = await ytdlget(url);
	const formatted_data = formatYtdata(data, {
		type: "mp4"
	});
	const formatted_aud_data = formatYtdata(data, {
		type: "mp3"
	});
	var media = [];
	for (const key in formatted_data) {
		if (formatted_data[key].quality === "auto") {
			delete formatted_data[key];
		}
	}
	let aud_result = await convert(
		formatted_aud_data[0].vid,
		formatted_aud_data[0].id,
	);
	let res = {
		title: aud_result.title,
		thumbnail: `https://i.ytimg.com/vi/${formatted_data[0].vid}/0.jpg`,
		media,
	};
	media.push({
		size: formatted_aud_data[0].size,
		type: aud_result.ftype,
		quality: formatted_aud_data[0].quality,
		url: aud_result.dlink,
	});
	for (const item in formatted_data) {
		let vid_result = await convert(
			formatted_data[item].vid,
			formatted_data[item].id,
		);
		media.push({
			type: vid_result.ftype,
			quality: vid_result.fquality,
			size: formatted_data[item].size,
			downloadUrl: vid_result.dlink,
		});
	}
	return res;
}

module.exports = {
	AddMp3Meta,
	getJson,
	getBuffer,
	ytdlx,
	toAudio,
	gemini,
	toVideo,
	imgurUpload,
	imageToWebp,
	videoToWebp,
	writeExifImg,
	writeExifVid,
	writeExifWebp,
	createInteractiveMessage
}
