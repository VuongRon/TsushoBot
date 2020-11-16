require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const botCommands = require("./commands");
const helpCommand = require("./commands/help.js");
const db = require("./models").sequelize;

Object.keys(botCommands).map((key) => {
  client.commands.set(botCommands[key].name, botCommands[key]);
});

client.on("message", (msg) => {
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  if (command === '!help') { helpCommand.execute(msg, args, client.commands); return; }

  try {
    console.log(`called command: ${client.commands.get(command).name}`);
    client.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("Something broke and that last command did not work.");
  }
});

const TOKEN = process.env.TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN);
