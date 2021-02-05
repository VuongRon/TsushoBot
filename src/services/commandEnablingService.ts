import { CommandCollection } from "../types/command.type";

/**
 * Inspects the ENABLED_COMMANDS .env key and sets the value of the "enabled" flag on
 * each processed command if it has been specified on the list.
 *
 * NOTE: If the ENABLED_COMMANDS key is empty or left commented out, __all__
 * commands will be enabled by default. If at least one command will be present
 * on the list, only the specified commands will be enabled
 *
 * @param {CommandCollection}  botCommands Reference to the imported bot commands object
 */
export function enableCommands(botCommands: CommandCollection): void {
  let enabledCommands: string[];
  let enabledCommandsStr: string | undefined = process.env.ENABLED_COMMANDS;

  // No commands variable was specified in the .env
  if (!enabledCommandsStr) return;

  enabledCommands = enabledCommandsStr.split(/\s+/gi);
  enabledCommands.forEach((s, index, arr) => (arr[index] = s.toLowerCase()));

  /**
   * Check if enabledCommands is null \ empty
   * This will leave all commands enabled by default if nothing was specified on the ENABLED_COMMANDS list
   */
  if (enabledCommands && enabledCommands.length > 0) {
    return;
  }

  // Disable all commands except enabled commands (commands are enabled by default when imported)
  for (let key in botCommands) {
    if (enabledCommands.findIndex((commandName) => commandName == key) == -1) {
      botCommands[key]["enabled"] = false;
    }
  }
}
