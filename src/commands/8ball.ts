import { CommandInteraction } from "discord.js";
import { CommandTemplate } from "../types/command.type";
import { embed } from "../services/embedService";
import { getRandomInt } from "../services/rngService";
import responses from "./config/eightBall.json";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ApplicationCommandOptionType } from "discord-api-types";

const embedMessage = async (msg, args) => {
  const argsTitle = true;
  return embed(msg, args, {
    argsTitle,
    description: responses[getRandomInt(0, responses.length, false)],
  });
};

// const execute = async (msg: Message, args: string[]) => {
//   await embedMessage(msg, args);
// }

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply(responses[getRandomInt(0, responses.length, false)]);
};

const commandTemplate: CommandTemplate = {
  name: "8ball",
  description: "Answers questions.",
  options: [
    {
      name: "input",
      type: 3,
      description: "The input to display as the heading",
    },
  ],
  execute: execute,
};

export { commandTemplate };
