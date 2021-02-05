import { Collection, Client } from "discord.js";
import { CommandCollection } from "../types/command.type";

class ExtendedClient extends Client {
    /**
     * @param   {CommandCollection}  botCommands  Collection of preprocessed bot commands
     */
    constructor(botCommands: CommandCollection) {
        super();
        this.commands = botCommands;
    }

    /**
     * Hashmap of string->Command
     */
    public commands: CommandCollection = new Collection();
}

export {
    ExtendedClient
}
