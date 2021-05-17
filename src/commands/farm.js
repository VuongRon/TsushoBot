const embedService = require("../services/embedService");
const rngService = require("../services/rngService");

import { UserModule } from "../models";

const farmOutcomes = require("./config/farm.json");

const embed = (msg, args, count, userBalance) => {
  const message = `${rngService.getRandomArrayIndex(
    // Adjust farmOutcomes index offset to 0-based indexing
    farmOutcomes[count - 1]
  )}\n\nYou earned **${count}** Tsushobucks.\n\nYour total Tsushobuck balance is **${userBalance}**.`;
  return embedService.embedMessage(msg, args, message);
};

const count = async (msg, args) => {
  const authorId = msg.author.id;
  const user = await UserModule.findOrCreateByDiscordId(authorId);
  const count = rngService.getRandomInt(1, 10);
  user.balance += count;
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, count, user.balance);
};

const execute = (msg, args) => {
  count(msg, args);
}

const commandTemplate = {
  name: "farm",
  description: "Farm Tsushobucks.",
  execute: execute
}

export {
  commandTemplate
}