require("dotenv").config();

module.exports = {
  name: "!version",
  description: "Shows the current TsushoBot version.",
  execute(msg, args) {
    msg.channel.send(`Current TsushoBot version is ${process.env.VERSION}`);
  },
};
