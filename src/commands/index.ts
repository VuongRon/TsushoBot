import { CommandCollection } from "../types/command.type";
import { CommandsFactory } from "./utils/commands-factory";

// bot command templates
import { commandTemplate as eightBallCommand } from "./8ball";
import { commandTemplate as testCommand } from "./test";
// Initialize bot commands collection
let botCommands: CommandCollection = CommandsFactory.createCommandCollection([eightBallCommand]);

export { botCommands };
