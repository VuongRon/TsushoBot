import { CommandInteraction } from "discord.js";
import { CommandTemplate } from "../types/command.type";
import { EmbedBuilder } from "../services/EmbedBuilder";
import { CommandResponse, EmbedTripleColumn } from "../types/discord-types.type";

import { Stats } from "./classes/Stats";

const commandTemplate: CommandTemplate = {
  name: "stats",
  description: "Shows your randomized stats. Each stat is normally distributed.",

  execute: function (interaction: CommandInteraction): CommandResponse {
    /**
     * COMMAND LOGIC
     */
    const stats = new Stats();
    //-

    /**
     * EMBED CONSTRUCTION
     */
    const embed: EmbedBuilder = new EmbedBuilder(interaction, true)
      .setDescription("Your stats:")
      .addRow(<EmbedTripleColumn>[
        { name: ":eyes: Looks", value: stats.looks },
        { name: ":brain: IQ", value: stats.iq },
        { name: ":video_game: MMR", value: stats.mmr },
      ])
      .addRow(<EmbedTripleColumn>[
        { name: ":moneybag: Salary", value: stats.salary },
        { name: ":pinching_hand: Length", value: stats.length },
        { name: ":straight_ruler: Height", value: stats.height },
      ])
      .addField(":scales: Weight", stats.weight);

    return {
      embeds: [embed.get()],
    };
  },
};

export { commandTemplate };
