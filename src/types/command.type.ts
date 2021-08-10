import { Collection, Message } from "discord.js";

interface CommandTemplate {
  name: string;
  description: string;
  execute: (msg: Message, args: string[], options: any) => void;
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
   * Command execution entry point
   */
  private _execute: (msg: Message, args: string[], options: any) => void;

  public execute(msg: Message, args: string[], options: any): void {
    if (this.canExecute(msg)) {
      this._execute(msg, args, options);
    }
  }

  constructor(
    name: string,
    description: string,
    enabled: boolean,
    bindings: Set<string>,
    execute: (msg: Message, args: string[], options: any) => void
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
