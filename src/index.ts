import * as dotenv from "dotenv";
dotenv.config();
import { Collection, Client, Message } from "discord.js";
import { CommandCollector } from "./types/command.type";
import { botCommands } from "./commands";
import * as channelBindingService from "./services/channelBindingService";
import * as commandEnablingService from "./services/commandEnablingService";
// TODO - refactor `require`uses to typescript imports
const constants = require("./config/constants").constants;

class ExtendedClient extends Client {
  /**
   * Hashmap of string->Command
   */
  public commands: CommandCollector = new Collection();
}

const client = new ExtendedClient();
const commandsCollection: CommandCollector = new Collection(Object.entries(botCommands));

/**
 * Enabled commands processing
 */
commandEnablingService.enableCommands(commandsCollection);

/**
 * Check which commands have binding definitions and add them to the commandInstance
 */
channelBindingService.processBindings(commandsCollection);

client.on("message", (msg: any) => {
// Send our bot commands to the client
client.commands = commandsCollection;
  /**
   * Don't process bot messages, could be even more specific to ignore self messages.
   */
  if (msg.author.bot) {
    return;
  }
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase().substr(1);
  const options: any = {};

  if (!client.commands.has(command)) return;

  /**
   * Automatically checks if the requested command can be executed in the channel
   * this message came from.
   * 
   * This behavior ignores everything by default unless there is a binding specified 
   * between the __command name__ and __channel ID__.
   * 
   * Presence in the channel bindings (not in the environment!) means 
   * that commands can only be executed in specific channels.
   * 
   * This assumes a valid channel ID has been specified in the binding configuration, otherwise
   * the command will not get executed due to the channel ID mismatch
   */

  const commandInstance = client.commands.get(command);
  /**
   * Check if command instance exists in given key index
   */
  if (!commandInstance) return;

  /**
   * Check whether the command is enabled - if it is not - ignore and exit processing
   */
  if (!commandInstance.enabled) return;

  const boundCommand = new channelBindingService(msg, commandInstance.name);
  if (boundCommand.belongsToThisChannel() === false) {
    // If needed, add console output informing about the command rejection
    return;
  }

  /**
   * At this point we have the command initially processed by the Channel Binding Service,
   * so we can now check if the owner of this message is attempting to execute a command
   * that is currently on cooldown for that user.
   * 
   * NOTICE: This is a user-specific and command-specific rejection
   */
  const throttledCommand = new commandThrottlingService(boundCommand.commandName, msg.author.username);
  if (throttledCommand.canBeExecuted() === false) {
    // Reject the execution as we don't want to hit the rate limit from spamming the specific command
    // Possibly, integrate this with command tracking for spam detection
    //
    // Consider logging this rejection to warn spammers
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
  client.user ?
    console.log(`Logged in as ${client.user.tag}!`) : console.log(`Logged in without defined user`);
  ;
});

client.login(TOKEN);
