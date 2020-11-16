require("dotenv").config();

module.exports = {
  name: "!version",
  description: "Shows the current TsushoBot version.",
  execute(msg, args, options = {}) {
    msg.channel.send(`Current TsushoBot version is ${process.env.VERSION}`);
  },
};
