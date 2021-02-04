import { Message } from "discord.js";

export type Command = {
  /**
   * Name of the command
   */
  name: string;
  /**
   * Command description
   */
  description: string;
  /**
   * Indicates whether the command is enabled or not
   */
  enabled: boolean;
  /**
   * Channel Bindings - allows the command to be executed only from the specified channels.
   * Defines an array of string ChannelIDs
   */
  bindings: string[];
  /**
   * Command execution entry point
   */
  execute: (msg: Message, args: string[], options: any) => void;
};
