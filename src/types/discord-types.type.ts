import { Client } from "discord.js";
import { CommandCollection } from "./command.type";

class ExtendedClient extends Client {
    /**
     * 
     * @param botCommands Collection of bot commands
     */
    constructor(botCommands: CommandCollection) {
        super();
        this.commands = botCommands;
    }

    /**
     * Hashmap of string->Command
     */
    public commands: CommandCollection;
}

export {
    ExtendedClient
}
