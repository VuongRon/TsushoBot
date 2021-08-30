import { CommandInteraction } from "discord.js";

import { getRandomInt } from "../services/rngService";
import { CommandTemplate } from "../types/command.type";
import { EmbedBuilder } from "../services/EmbedBuilder";
import { CommandResponse } from "../types/discord-types.type";

import responses from "./config/eightBall.json";

const commandTemplate: CommandTemplate = {
  name: "eightball",
  description: "Answers questions.",

  execute: function (interaction: CommandInteraction): CommandResponse {
    /**
     * COMMAND LOGIC
     */
    const response: string = responses[getRandomInt(0, responses.length, false)];
    //-

    /**
     * EMBED CONSTRUCTION
     */
    const embed: EmbedBuilder = new EmbedBuilder(interaction, true).setDescription(response);

    // TODO: find a way to shorten this as much as possible
    for (const option of interaction.options.data) {
      if (option.name === "question") {
        embed.setTitle(option.value!.toString());
      }
    }

    return {
      embeds: [embed.get()],
    };
  },
};

export { commandTemplate };
