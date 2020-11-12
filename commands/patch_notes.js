require("dotenv").config();
const patchNotes = require("./patch_notes.json");

const readPatchNotes = (version) => {
  let responses = [];
  responses.push(` Patch notes for v${version}:`);
  responses.push("");
  for (index in patchNotes[version]) {
    responses.push(patchNotes[version][index]);
  }
  return responses.join("\n");
};

const getPatchNotes = (msg, args) => {
  const version =
    args && args[0] && patchNotes[args[0]] ? args[0] : process.env.VERSION;
  msg.reply(readPatchNotes(version));
};

module.exports = {
  name: "!patchnotes",
  description: "patchnotes",
  execute(msg, args) {
    getPatchNotes(msg, args);
  },
};
