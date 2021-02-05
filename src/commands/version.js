require("dotenv").config();
const embedService = require("../services/embedService");

const execute = (msg, args, config, options) => {
  const message = `Current TsushoBot version is ${process.env.VERSION}`;
  return embedService.embedMessage(msg, args, message);
}

const commandTemplate = {
  name: "version",
  description: "Shows the current TsushoBot version.",
  config: null,
  execute: execute
}

export {
  commandTemplate
}