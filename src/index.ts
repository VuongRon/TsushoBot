import { config } from "dotenv";
config();

import { Collection,  Message } from "discord.js";
import { CommandCollection } from "./types/command.type";
import { ExtendedClient } from "./classes/client";
import { botCommands } from "./commands";
import * as channelBindingService from "./services/channelBindingService";
import * as commandEnablingService from "./services/commandEnablingService";
// TODO - refactor `require`uses to typescript imports
const constants = require("./config/constants").constants;

// Prepare the imported commands
// TODO: The Command Importer needs to be rewritten...
const commandsCollection: CommandCollection = new Collection(Object.entries(botCommands));

/**
 * Walk through the imported commands and override "enabled" flag on each command
 * according to the commandEnablingService's behavior
 * @see enableCommands
 */
commandEnablingService.enableCommands(commandsCollection);

/**
 * Check which commands have binding definitions and add them to the each command in this collection
 */
channelBindingService.processBindings(commandsCollection);

// Send our bot commands to the client
const client = new ExtendedClient(commandsCollection);
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

  /**
   * Check whether the command is enabled - if it is not - ignore and exit processing
   */
  if (!commandInstance.enabled) return;

  /**
   * Check if the command has channel bindings defined.
   * If there are no bindings - the command should be allowed to execute everywhere
   * If the bindings are present, the command should be executed only in the channels
   * with matching IDs
   */
  if (commandInstance.bindings && !channelBindingService.isCommandAllowed(commandInstance, msg)) {
    return;
  }

  try {
    console.log(`called command: ${commandInstance.name}`);
    if (command === "!help") options.commands = client.commands;
    options.constants = constants;
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
