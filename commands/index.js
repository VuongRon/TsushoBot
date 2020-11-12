const fs = require("fs");
let files = fs.readdirSync("commands");
files = files.filter((e) => e.match(/.*\.js/gi));
const temp = {};

for (index in files) {
  const fileName = files[index].split(".")[0];
  temp[fileName] = require(`./${fileName}`);
}

module.exports = temp;
