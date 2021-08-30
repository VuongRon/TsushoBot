import { CommandCollection } from "../types/command.type";
import { CommandsFactory } from "./utils/commands-factory";

// bot command templates
import { commandTemplate as eightball } from "./8ball";
import { commandTemplate as coinflip } from "./coinflip";
import { commandTemplate as stats } from "./stats";

// Initialize bot commands collection
let botCommands: CommandCollection = CommandsFactory.createCommandCollection([coinflip, eightball, stats]);

export { botCommands };
