const embedService = require("../services/embedService");

import { FishermanModule } from "../models";

const embed = (msg, args, valueOfInf) => {
  const argsTitle = true;
  let fields = [];
  if (valueOfInf == null) {
    fields = [
      {
        name: "An error occurred while trying to sell your inventory",
        value: "We were unable to sell your inventory, please try again later."
      }
    ]
  }
  fields = [
    {
      name: `You sold all your fish for **${valueOfInf}** Tsushobucks`,
      value: "Dont go spend it all in one place!",
    },
  ];
  fields.forEach(field => {
    field.inline = true;
  });
  return embedService.embed(msg, args, {
    argsTitle,
    fields,
  });
};

const selling = async (msg, args) => {
  const fisherman = await FishermanModule.findOrCreateByDiscordId(msg.author.id);
  let valueOfInf = await FishermanModule.sellInventory(fisherman);
  if (valueOfInf == -1) {
    valueOfInf = null;
  }
  return embed(msg, args, valueOfInf);
};

module.exports = {
  name: "!sell",
  description: "Sells your fish inventory for Tsushobucks",
  execute(msg, args, options = {}) {
    selling(msg, args);
  },
};
