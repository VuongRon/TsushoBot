import { Message } from "discord.js";
import { Command, CommandCollector } from "../types/command.type";

const envBindingPartial = "CHANNEL_BINDING_";

/**
 * Looks for defined channel bindings in the .env and adds them to the corresponding
 * commands
 *
 * @param {CommandCollector} botCommands Reference to the imported bot commands
 */
function processBindings(botCommands: CommandCollector): void {
  let bindingKey: string;
  // Bindings might become undefined when left commented or empty
  let binding: string | undefined;

  for (const command in botCommands) {
    bindingKey = envBindingPartial.concat(command.toUpperCase());

    // Access the string of discord channel IDs specified for each command, space-separated
    // e.g. CHANNEL_BINDING_[COMMAND NAME] = 123, 456
    binding = process.env[bindingKey];

    // Even though the channel binding might be left uncommented, it will not
    // disable the command due to the id mismatch
    if (binding) {
      // Array of specified channel ids bound to the specified channel
      let commandChannelIds = [...binding.split(/\s+/gi)];
      botCommands[command].bindings = commandChannelIds;
    }
  }
}

/**
 * Checks if the requested command can be executed in the channel this message
 * came from.
 *
 * This assumes valid channel IDs have been specified in the binding configuration,
 * otherwise the command will not get executed due to the channel ID mismatch
 *
 * @param   {Command}     commandInstance   Processed Discord command instance
 * @param   {Message}     message           Currently processed Discord message
 *
 * @return  {boolean}
 */
function isCommandAllowed(commandInstance: Command, message: Message): boolean {
  const condition = commandInstance.bindings.includes(message.channel.id);

  /**
   * TODO:
   * Find out if logger is actually needed, create a logger service, also if needed
   *
   * This requires leaving the property check, because DMChannels __do not__ contain "name" property
   */
  if (!condition && "name" in message.channel) {
    console.log(`Command "${commandInstance.name}" is not bound to "${message.channel.name}" channel`);
  }

  return condition;
}

export { isCommandAllowed, processBindings };
