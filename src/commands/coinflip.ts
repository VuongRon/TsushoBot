import { CommandInteraction } from "discord.js";
import { CommandTemplate } from "../types/command.type";
import { EmbedBuilder } from "../services/EmbedBuilder";
import { CommandResponse } from "../types/discord-types.type";

const commandTemplate: CommandTemplate = {
  name: "coinflip",
  description: "Decide your fate by flipping a coin.",

  execute: function (interaction: CommandInteraction): CommandResponse {
    /**
     * COMMAND LOGIC
     */
    const coinFlip: string = Math.round(Math.random()) > 0.5 ? "Heads." : "Tails.";
    //-

    /**
     * EMBED CONSTRUCTION
     */
    const embed: EmbedBuilder = new EmbedBuilder(interaction, true).setDescription(coinFlip);

    // Coinflip accepts user input, which can be used as embed title
    // TODO: find a way to shorten this as much as possible
    for (const option of interaction.options.data) {
      if (option.name === "query") {
        embed.setTitle(option.value!.toString());
      }
    }

    return {
      embeds: [embed.get()],
    };
  },
};

export { commandTemplate };
