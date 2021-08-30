import {
  Client,
  ClientOptions,
  EmbedFieldData,
  InteractionReplyOptions,
  MessageEmbedAuthor,
  MessagePayload,
} from "discord.js";
import { CommandCollection } from "./command.type";
import { registerCommands } from "../services/commandRegisteringService";

export class ExtendedClient extends Client {
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
export type CommandResponse = string | InteractionReplyOptions | MessagePayload | undefined;

/** Array of TWO EmbedField, which will be forced to have inline style  */
export type EmbedDoubleColumn = [EmbedFieldData, EmbedFieldData];

/** Array of THREE EmbedField, which will be forced to have inline style  */
export type EmbedTripleColumn = [EmbedFieldData, EmbedFieldData, EmbedFieldData];
