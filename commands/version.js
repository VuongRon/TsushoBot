require("dotenv").config();
const embedService = require("../services/embedService");

module.exports = {
  name: "!version",
  description: "Shows the current TsushoBot version.",
  execute(msg, args, options = {}) {
    const message = `Current TsushoBot version is ${process.env.VERSION}`;
    return embedService.embedMessage(msg, message);
  },
};
