const embedService = require("../services/embedService");
const fishService = require("../services/fishService");

import { UserModule, FishermanModule } from "../models";

const embed = (msg, args, user, item, transactionSucceeded) => {
  const author = {
    name: `${msg.author.username} is purchasing an item`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = false;
  let fields;
  if (transactionSucceeded == undefined) {
    fields = [
      {
        name: "The transaction failed",
        value: `You either dont have enough money or specified the wrong item.`,
      },
    ];
  } else if (transactionSucceeded) {
    fields = [
      {
        name: `You bought a ${item.name}`,
        value: `${item.flvr1}`,
      },
    ];
  } else {
    fields = [
      {
        name: `You already own a ${item.name}`,
        value: `${item.flvr2}`,
      },
    ];
  }
  fields.forEach(field => {
    field.inline = true;
  });
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

const buying = async (msg, args) => {
  const user = await UserModule.findOrCreateByDiscordId(msg.author.id);
  let id;
  if (Number.isInteger(parseInt(args)) && args.length == 1) {
    id = parseInt(args);
  }
  let transactionSucceeded = undefined;
  if (Number.isInteger(id) && id > 0 && id < 4) {
    transactionSucceeded = await FishermanModule.addItem(id, user);
  }
  let item = new fishService.Item(id);
  return embed(msg, args, user, item, transactionSucceeded);
};

const execute = (msg, args) => {
  buying(msg, args);
}

const commandTemplate = {
  name: "buy",
  description: "Buying items",
  execute: execute
}

export {
  commandTemplate
}