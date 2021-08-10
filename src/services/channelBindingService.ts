const envBindingPartial = "CHANNEL_BINDING_";

/**
 * Returns the bindings set for the specified command
 * @param commandName The command name to get the bindings for
 */
function getCommandBindings(commandName: string): Set<string> {
  let bindingKey: string;
  // Bindings might become undefined when left commented or empty
  let bindingStr: string | undefined;

  bindingKey = envBindingPartial.concat(commandName.toUpperCase());

  // Access the string of discord channel IDs specified for each command, space-separated
  // e.g. CHANNEL_BINDING_[COMMAND NAME] = 123, 456
  bindingStr = process.env[bindingKey];

  // Even though the channel binding might be left uncommented, it will not
  // disable the command due to the id mismatch
  if (bindingStr) {
    // Array of specified channel ids bound to the specified channel
    let commandChannelIds = [...bindingStr.split(/\s+/gi)];
    // Remove duplicates by initializing a new set out of the channel ids array
    return new Set(commandChannelIds);
  }

  // Return empty set
  return new Set();
}

export { getCommandBindings };
