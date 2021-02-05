const embedService = require("../services/embedService");
const fishService = require("../services/fishService");

import { FishermanModule } from "../models";

const embed = (msg, args, fisherman) => {
  const author = {
    name: `The Shop`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = true;
  let allItems = fishService.getAllItems();
  let fields = [];
  allItems.forEach((item) =>
    fields.push({
      name: `${item.id}. ${item.name}`,
      value: !(fisherman[item.userp])
        ? `**${item.price}** Tsushobucks \n${item.flvrshop}`
        : `:white_check_mark: You own this item`,
    })
  );

  fields.forEach(field => {
    field.inline = true;
  });
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

const shop = async (msg, args) => {
  const fisherman = await FishermanModule.findOrCreateByDiscordId(msg.author.id);
  return embed(msg, args, fisherman);
};

const execute = (msg, args, config, options) => {
  shop(msg, args);
}

const commandTemplate = {
  name: "shop",
  description: "Spend your Tsushobucks here",
  execute: execute
}

export {
  commandTemplate
}