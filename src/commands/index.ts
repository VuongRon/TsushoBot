import { CommandCollection } from "../types/command.type";
import { CommandsFactory } from "./utils/commands-factory";

// bot command templates
import { commandTemplate as eightBallCommand } from "./8ball";
import { commandTemplate as coinflipCommand } from "./coinflip";
import { commandTemplate as statsCommand } from "./stats";
// Initialize bot commands collection
let botCommands: CommandCollection = CommandsFactory.createCommandCollection([
  eightBallCommand,
  // coinflipCommand,
  // statsCommand,
]);

export { botCommands };
