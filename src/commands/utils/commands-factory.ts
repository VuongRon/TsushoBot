import { Collection } from "discord.js";
import {
  Command,
  CommandCollection,
  CommandTemplate,
} from "../../types/command.type";

namespace CommandsFactory {
  export function createCommandCollection(
    templates: CommandTemplate[]
  ): CommandCollection {
    let collection: CommandCollection = new Collection();

    let command: Command;
    for (let template of templates) {
      command = new Command(
        template.name,
        template.description,
        template.enabled,
        template.bindings,
        template.options,
        template.execute
      );

      // Add new command to the collection
      collection.set(command.name, command);
    }

    return collection;
  }
}

export { CommandsFactory };
