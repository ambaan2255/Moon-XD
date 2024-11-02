const fs = require('fs')
const unzipper = require('unzipper')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function Hem () {
  try { 
fs.createReadStream('./Newa.zip')
  .pipe(unzipper.Extract({ path: './' }));
} catch (e) {
console.log("error : " + e)
}
}
Hem()