require("dotenv").config();

module.exports = {
  name: "!version",
  description: "Current TsushoBot Version",
  execute(msg, args) {
    msg.channel.send(`Current TsushoBot version is ${process.env.VERSION}`);
  },
};
