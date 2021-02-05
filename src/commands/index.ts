import { readdirSync } from "fs";

// Read and export all commands
let files: string[] = readdirSync(__dirname);

const re = new RegExp(/^(?!index\b).*\.js$/gi);
files = files.filter(f => re.test(f));

const botCommands: {} = {};

for (let index in files) {
  const fileName = files[index].split(".")[0];
  botCommands[fileName] = require(`./${fileName}`);

  // Enable each command by default
  botCommands[fileName]["enabled"] = true;
}

export {
  botCommands
}
