require("dotenv").config();
const embedService = require("../services/embedService");
const patchNotes = require("./patch_notes.json");

const readPatchNotes = (version) => {
  let responses = [];
  responses.push(`Patch notes for v${version}:`);
  responses.push("");
  for (index in patchNotes[version]) {
    responses.push(patchNotes[version][index]);
  }
  return responses.join("\n");
};

const getPatchNotes = (msg, args) => {
  const version =
    args && args[0] && patchNotes[args[0]] ? args[0] : process.env.VERSION;
  return embedService.embedMessage(msg, args, readPatchNotes(version));
};

module.exports = {
  name: "!patchnotes",
  description:
    "Shows the patch notes. Accepts a version as an argument to show a specific release.",
  execute(msg, args, options = {}) {
    return getPatchNotes(msg, args);
  },
};
