const embedService = require("../services/embedService");

import { FishermanModule, UserModule } from "../models";

const embed = (msg, args, user, fisherman) => {
  const argsTitle = true;
  const author = {
    name: `${msg.author.username}'s inventory`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const fields = [
    {
      name: ":motorized_wheelchair:",
      value: `**${fisherman.motorized_wheelchair}**`,
    },
    {
      name: ":manual_wheelchair:",
      value: `**${fisherman.manual_wheelchair}**`,
    },
    {
      name: ":heart:",
      value: `**${fisherman.heart}**`,
    },
    {
      name: ":wrench:",
      value: `**${fisherman.wrench}**`,
    },
    {
      name: ":boot:",
      value: `**${fisherman.boot}**`,
    },
    {
      name: ":fish:",
      value: `**${fisherman.fish}**`,
    },
    {
      name: ":tropical_fish:",
      value: `**${fisherman.tropical_fish}**`,
    },
    {
      name: ":blowfish:",
      value: `**${fisherman.blowfish}**`,
    },
    {
      name: ":yen:",
      value: `**${user.balance}**`,
    },
    {
      name: "\u200b",
      value: `Your current inventory is worth **${FishermanModule.getValueOfInv(fisherman)}** Tsushobucks`,
    },
  ];
  fields.forEach(field => {
    field["inline"] = true;
  });
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

const inventory = async (msg, args) => {
  const fishermanModel = await FishermanModule.findOrCreateByDiscordId(msg.author.id);
  const userModel = await UserModule.User.findByPk(fishermanModel.userId);

  return embed(msg, args, userModel, fishermanModel);
};

module.exports = {
  name: "!inventory",
  description: "Shows your fish inventory.",
  execute(msg, args, options = {}) {
    inventory(msg, args);
  },
};
