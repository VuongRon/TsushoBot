const embedService = require("../services/embedService");

import { FishermanModule } from "../models";

const embed = (msg, args, valueOfInv) => {
  const argsTitle = true;
  let fields = [];
  let name, value = '';

  if (valueOfInv == null) {
    name = "An error occurred while trying to sell your inventory";
    value = "We were unable to sell your inventory, please try again later.";
  }
  else {
    name = valueOfInv == 0 ?
      "You didn't have anything of value to sell" :
      `You sold all your fish for **${valueOfInv}** Tsushobucks`;
    value = valueOfInv == 0 ?
      "Your pockets were empty and you didn't have anything to sell" :
      "Dont go spend it all in one place!";
  }

  fields = [
    {
      name: name,
      value: value,
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
  let valueOfInv = await FishermanModule.sellInventory(fisherman);
  if (valueOfInv == -1) {
    valueOfInv = null;
  }
  return embed(msg, args, valueOfInv);
};

module.exports = {
  name: "!sell",
  description: "Sells your fish inventory for Tsushobucks",
  execute(msg, args, options = {}) {
    selling(msg, args);
  },
};
