import { Collection, Message, CommandInteraction } from "discord.js";
import { CommandResponse } from "./discord-types.type";

interface CommandTemplate {
  name: string;
  description: string;
  execute: (interaction: CommandInteraction) => CommandResponse;
}

class Command implements CommandTemplate {
  /**
   * Name of the command
   */
  private _name: string;

  public get name(): string {
    return this._name;
  }

  /**
   * Command description
   */
  private _description: string;

  public get description(): string {
    return this._description;
  }

  /**
   * Indicates whether the command is enabled or not
   */
  private _enabled: boolean;

  public get enabled(): boolean {
    return this._enabled;
  }

  /**
   * Channel Bindings - allows the command to be executed only from the specified channels.
   * Defines an array of string ChannelIDs
   */
  private _bindings: Set<string>;

  public get bindings(): Set<string> {
    return this._bindings;
  }

  /**
   * Returns an Embed Response for the Interaction Reply built by this command
   *
   * @param   {CommandInteraction}  interaction  Interaction Object received from client event upon registering a slash command execution
   */
  private _execute: (interaction: CommandInteraction) => CommandResponse;

  public execute(interaction: CommandInteraction): CommandResponse {
    return this._execute(interaction);
  }

  constructor(
    name: string,
    description: string,
    enabled: boolean,
    bindings: Set<string>,
    execute: (interaction: CommandInteraction) => CommandResponse
  ) {
    this._name = name;
    this._description = description;
    this._enabled = enabled;
    this._bindings = bindings;
    this._execute = execute;
  }

  private canExecute(msg: Message): boolean {
    return this._enabled && this.isChannelBindingValid(msg);
  }

  /**
   * Checks if the command can be executed in the channel this message
   * came from.
   *
   * This assumes valid channel IDs have been specified in the binding configuration,
   * otherwise the command will not get executed due to the channel ID mismatch
   * @param message Currently processed Discord message
   * @returns whether the binding is valid for the specified message
   */
  isChannelBindingValid(message: Message): boolean {
    // if bindings are empty, return true as command can execute everywhere
    if (this._bindings.size == 0) return true;

    const channelBindingValid = this._bindings.has(message.channel.id);

    return channelBindingValid;
  }
}

type CommandCollection = Collection<string, Command>;

export { CommandTemplate, Command, CommandCollection };
