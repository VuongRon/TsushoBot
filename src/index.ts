require("dotenv").config();
import { Collection, Client } from "discord.js";

type Command = {
  /**
   * Name of the command
   */
  name: string,
  /**
   * Command description
   */
  description: string,
  /**
   * Indicates whether the command is enabled or not
   */
  enabled: boolean,
  /**
   * Command execution entry point
   */
  execute: (msg: string, args: any[], options: any) => void;
}

class ExtendedClient extends Client {
  /**
   * Hashmap of string->Command
   */
  public commands: Collection<string, Command> = new Collection();
}

const client = new ExtendedClient();

const botCommands = require("./commands");
const channelBindingService = require("./services/channelBindingService").ChannelBinding;
const commandThrottlingService = require("./services/commandThrottlingService").CommandThrottling;
const constants = require("./config/constants").constants;

/**
 * Enabled commands processing
 */
let enabledCommands: string[] = [];
let enabledCommandsStr = process.env.ENABLED_COMMANDS;
if (enabledCommandsStr) {
  enabledCommands = enabledCommandsStr.split(/\s+/gi);

  enabledCommands.forEach((s, index, arr) => arr[index] = s.toLowerCase());
}

/**
 * Check if enabledCommands is null \ empty
 */
if (enabledCommands && enabledCommands.length > 0) {
  // Disable all commands except enabled commands (commands are enabled by default when imported)
  for (let key in botCommands) {
    if (enabledCommands.findIndex(commandName => commandName == key) == -1) {
      botCommands[key]["enabled"] = false;
    }
  } 
}

client.commands = new Collection(Object.entries(botCommands));

client.on("message", (msg: any) => {
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
   * This place is reserved for another service in the chain: CommandWhitelistingService
   * This service should filter the command before ChannelBinding and Throttling
   */

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
