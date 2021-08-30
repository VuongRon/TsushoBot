import { Collection } from "discord.js";

import { getEnabledCommandsSet } from "../../services/commandEnablingService";
import { getCommandBindings } from "../../services/channelBindingService";
import {
  Command,
  CommandCollection,
  CommandTemplate,
} from "../../types/command.type";

export function createCommandCollection(
  templates: CommandTemplate[]
): CommandCollection {
  const collection: CommandCollection = new Collection();

  const enabledCommandsSet = getEnabledCommandsSet();

  let command: Command;
  for (const template of templates) {
    // enabled by default
    let isEnabled = true;
    if (enabledCommandsSet) {
      isEnabled = enabledCommandsSet.has(template.name);
    }

    const bindings = getCommandBindings(template.name);

    command = new Command(
      template.name,
      template.description,
      isEnabled,
      bindings,
      template.execute
    );

    // Add new command to the collection
    collection.set(command.name, command);
  }

  return collection;
}
