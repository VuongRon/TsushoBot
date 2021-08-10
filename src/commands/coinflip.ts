const embedService = require("../services/embedService");
const rngService = require("../services/rngService");

const embedMessage = (msg, args) => {
  const argsTitle = true;
  return embedService.embed(msg, args, {
    argsTitle,
    description: `${rngService.getRandomInt(0, 1) === 0 ? "Heads." : "Tails."}`,
  });
};

const execute = (msg, args) => {
  embedMessage(msg, args);
};

const commandTemplate = {
  name: "coinflip",
  description: "Decide your fate by flipping a coin.",
  execute: execute,
};

export { commandTemplate };
