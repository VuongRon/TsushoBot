import { CommandCollection } from "../types/command.type";
import { CommandsFactory } from "./utils/commands-factory";

// bot command templates
import { commandTemplate as alkCommand } from "./alk";
import { commandTemplate as eightBallCommand } from "./8ball";
import { commandTemplate as approveCommand } from "./approve";
import { commandTemplate as buyCommand } from "./buy";
import { commandTemplate as cheemsCommand } from "./cheems";
import { commandTemplate as coinflipCommand } from "./coinflip";
import { commandTemplate as countCommand } from "./count";
import { commandTemplate as diceCommand } from "./dice";
import { commandTemplate as farmCommand } from "./farm";
import { commandTemplate as fishCommand } from "./fish";
import { commandTemplate as gambleCommand } from "./gamble";
import { commandTemplate as helpCommand } from "./help";
import { commandTemplate as inventoryCommand } from "./inventory";
import { commandTemplate as resourceCommand } from "./resource";
import { commandTemplate as sellCommand } from "./sell";
import { commandTemplate as shopCommand } from "./shop";
import { commandTemplate as statsCommand } from "./stats";
import { commandTemplate as versionCommand } from "./version";
import { commandTemplate as whitelistCommand } from "./whitelist";

// Initialize bot commands collection
let botCommands: CommandCollection =
  CommandsFactory.createCommandCollection([
    alkCommand,
    eightBallCommand,
    approveCommand,
    buyCommand,
    cheemsCommand,
    coinflipCommand,
    countCommand,
    diceCommand,
    farmCommand,
    fishCommand,
    gambleCommand,
    helpCommand,
    inventoryCommand,
    resourceCommand,
    sellCommand,
    shopCommand,
    statsCommand,
    versionCommand,
    whitelistCommand
  ]);

export {
  botCommands
}
