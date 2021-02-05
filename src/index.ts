import { config } from "dotenv";
config();

import { Message } from "discord.js";
import { ExtendedClient } from "./types/discord-types.type";
import { botCommands } from "./commands";

// Send our bot commands to the client
const client = new ExtendedClient(botCommands);
client.on("message", (msg: Message) => {
  /**
   * Don't process bot messages, could be even more specific to ignore self messages.
   */
  if (msg.author.bot) {
    return;
  }

  const args: string[] = msg.content.split(/ +/);
  const command: string = args.shift()!.toLowerCase().substr(1);
  const options: any = {};

  // Abort if the command string sent to the chat is not a command defined in this bot
  if (!client.commands.has(command)) return;

  const commandInstance = client.commands.get(command);
  /**
   * Check if command instance exists in given key index
   */
  if (!commandInstance) return;

  try {
    console.log(`called command: !${commandInstance.name}`);
    if (command == "help") options.commands = client.commands;
    commandInstance.execute(msg, args, options);
  } catch (error) {
    console.error(error);
    msg.reply("Something broke and that last command did not work.");
  }
});

const TOKEN = process.env.TOKEN;

client.on("ready", () => {
  client.user
    ? console.log(`Logged in as ${client.user.tag}!`)
    : console.log(`Logged in without defined user`);
});

client.login(TOKEN);
