const ENABLED_COMMANDS_KEY = "ENABLED_COMMANDS";

/**
 * Inspects the ENABLED_COMMANDS .env key and return a set of enabled command names
 *
 * NOTE: If the ENABLED_COMMANDS key is empty or left commented out, __all__
 * commands will be enabled by default. If at least one command will be present
 * on the list, only the specified commands will be enabled
 */
function getEnabledCommandsSet(): Set<string> | null {
  let enabledCommands: string[];
  let enabledCommandsStr: string | undefined = process.env[ENABLED_COMMANDS_KEY];

  // No commands variable was specified in the .env
  if (!enabledCommandsStr) return null;

  enabledCommands = enabledCommandsStr.split(/\s+/gi);
  enabledCommands.forEach((s, index, arr) => (arr[index] = s.toLowerCase()));

  /**
   * Check if enabledCommands is null \ empty
   * This will leave all commands enabled by default if nothing was specified on the ENABLED_COMMANDS list
   */
  if (enabledCommands && enabledCommands.length == 0) {
    return null;
  }

  return new Set<string>(enabledCommands);
}

export {
  getEnabledCommandsSet
}