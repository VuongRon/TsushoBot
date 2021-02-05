const embedService = require("../services/embedService");
const rngService = require("../services/rngService");

import { UserModule } from "../models";

const embed = (msg, args, count, userBalance, farmOutcomes) => {
  const message = `${rngService.getRandomArrayIndex(
    // Adjust farmOutcomes index offset to 0-based indexing
    farmOutcomes[count - 1]
  )}\n\nYou earned **${count}** Tsushobucks.\n\nYour total Tsushobuck balance is **${userBalance}**.`;
  return embedService.embedMessage(msg, args, message);
};

const count = async (msg, args, farmOutcomes) => {
  const authorId = msg.author.id;
  const user = await UserModule.findOrCreateByDiscordId(authorId);
  const count = rngService.getRandomInt(1, 10);
  user.balance += count;
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, count, user.balance, farmOutcomes);
};

const execute = (msg, args, config, options) => {
  count(msg, args, config);
}

const commandTemplate = {
  name: "farm",
  description: "Farm Tsushobucks.",
  config: null, /** TODO */
  execute: execute
}

export {
  commandTemplate
}