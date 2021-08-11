import { Client, ClientOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import { CommandCollection } from "./command.type";

class ExtendedClient extends Client {
  /**
   *
   * @param clientOptions An object containing the client options
   * @param botCommands Collection of bot commands
   */
  constructor(clientOptions: ClientOptions, botCommands: CommandCollection) {
    super(clientOptions);
    this.commands = botCommands;
  }

  /**
   * Hashmap of string->Command
   */
  public commands: CommandCollection;
}

/** Type of a reply handled by Interaction -> Reply. Commands  */
type CommandResponse = string | InteractionReplyOptions | MessagePayload;

export { ExtendedClient, CommandResponse };
