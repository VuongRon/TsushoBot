import { Collection } from "discord.js";
import {
  Command,
  CommandCollection,
  CommandTemplate,
} from "../../types/command.type";

namespace CommandsFactory {
  export function createCommandCollection(templates: CommandTemplate[]): CommandCollection {
    let collection: CommandCollection = new Collection();

    const enabledCommandsSet = getEnabledCommandsSet();

    let command: Command;
    for (let template of templates) {
      // enabled by default
      let isEnabled = true;
      if (enabledCommandsSet) {
        isEnabled = enabledCommandsSet.has(template.name);
      }

      let bindings = getCommandBindings(template.name);

      command = new Command(template.name, template.description, isEnabled, bindings, template.execute);

      // Add new command to the collection
      collection.set(command.name, command);
    }

    return collection;
  }
}

export { CommandsFactory };
