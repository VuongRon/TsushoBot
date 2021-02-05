import { Message } from "discord.js";

import { CommandTemplate } from "../types/command.type";
import { embed } from "../services/embedService";
import { getRandomInt } from "../services/rngService";

import responses from "./config/eightBall.json";

const embedMessage = (msg, args) => {
  const argsTitle = true;
  return embed(msg, args, {
    argsTitle,
    description: responses[getRandomInt(0, responses.length, false)],
  });
};

const execute = (msg: Message, args: string[]) => {
  embedMessage(msg, args);
}

const commandTemplate: CommandTemplate = {
  name: "8ball",
  description: "Answers questions.",
  execute: execute
}

export {
  commandTemplate
}