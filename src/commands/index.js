const fs = require("fs");
let files = fs.readdirSync(__dirname);

const re = new RegExp(/^(?!index\b).*\.js$/gi);
files = files.filter(f => re.test(f));

const temp = {};

for (let index in files) {
  const fileName = files[index].split(".")[0];
  temp[fileName] = require(`./${fileName}`);
}

module.exports = temp;

export { temp }