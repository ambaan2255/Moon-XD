const fs = require('fs');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
if (fs.existsSync('config.env')) {
  dotenv.config({
    path: './config.env'
  });
}

//const HANDLERS =  process.env.HANDLER === undefined ? "^" : process.env.HANDLER;

const HANDLERS = process.env.HANDLER === 'false' || process.env.HANDLER === 'null' ? '^' : '^';
const AUTHOR = process.env.AUTHOR || 'ꜱᴜᴩᴇʀɪᴏʀ';
const SUDO = process.env.SUDO || '919497705819,916282088181';
const OWNER_NAME = process.env.OWNER_NAME || 'ARJUNNN';
const BOT_NAME = process.env.BOT_NAME || 'MOON-XD';
const AUTO_STATUS_VIEW = process.env.AUTO_STATUS_VIEW || 'false';
const STATUS_REACTION = process.env.STATUS_REACTION || 'false';
const STATUS_REACTION_EMOJI = process.env.STATUS_REACTION_EMOJI || '🍉,🍓,🎀,💀,💗,📍,🔪,🛒,☠️,🐍,👍🏻';
const MENU_URL = process.env.MENU_URL || 'https://i.imgur.com/bKVHPEE.jpeg';
const WORK_TYPE = process.env.WORK_TYPE || 'public'
const DATABASE_URL = process.env.DATABASE_URL || './assets/database.db';
//const DATABASE_URL = DATABASE_URL
const DATABASE = DATABASE_URL === './assets/database.db'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
      })  
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
          native: true,
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      })

module.exports = {
  HANDLERS,
  AUTHOR,
  SUDO,
  OWNER_NAME,
  AUTO_STATUS_VIEW,
  STATUS_REACTION,
  STATUS_REACTION_EMOJI,
  BOT_NAME,
  WORK_TYPE,
  DATABASE
};
