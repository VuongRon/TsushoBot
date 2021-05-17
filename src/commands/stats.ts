import { embed } from "../services/embedService";
import { EmbedFieldData, Message } from "discord.js";
import { Stats } from "./classes/Stats";

const stats: Stats = new Stats();

const embedStats = (msg: Message, args: string[], options: any) => {
  const argsTitle: boolean = true;

  // Randomize the stats after each incoming message
  stats.randomize();

  const fields: EmbedFieldData[] = [
    {
      name: ":eyes: Looks",
      value: `${stats.looks}/10`,
    },
    {
      name: ":brain: IQ",
      value: `${stats.iq}`,
    },
    {
      name: ":video_game: MMR",
      value: `${stats.mmr}`,
    },
    {
      name: ":moneybag: Salary",
      value: `$${stats.salaryFormatted()}`,
    },
    {
      name: ":pinching_hand: Length",
      value: `${stats.lengthFormatted()}`,
    },
    {
      name: ":straight_ruler: Height",
      value: `${stats.heightFormatted()}`,
    },
    {
      name: ":scales: Weight",
      value: `${stats.weightFormatted()}`,
    },
  ];

  // Each field __has to__ be inline, just set them all to true
  fields.forEach((field) => {
    field.inline = true;
  });

  return embed(msg, args, {
    argsTitle,
    fields,
    options,
  });
};

const execute = (msg: Message, args: string[], options: any) => {
  embedStats(msg, args, options);
};

const commandTemplate = {
  name: "stats",
  description: "Shows your randomized stats. Each stat is normally distributed.",
  execute: execute,
};

export { commandTemplate };
