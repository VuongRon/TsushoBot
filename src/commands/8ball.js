const embedService = require("../services/embedService");
const rngService = require("../services/rngService");

const embedMessage = (msg, args) => {
  const argsTitle = true;
  // TODO extract responses into configuration file
  const responses = [
    "All signs point to yes...",
    "Yes!",
    "My sources say nope.",
    "You may rely on it.",
    "Concentrate and ask again...",
    "Outlook not so good...",
    "It is decidedly so!",
    "Better not tell you.",
    "Very doubtful.",
    "Yes - definitely!",
    "It is certain!",
    "Most likely.",
    "Ask again later.",
    "No!",
    "Outlook good.",
    "Don't count on it.",
    "Ask Tsusho - he would know.",
    "This needs further calculation - ask Nordis.",
    "God no... what the fuck?",
    "Fuck off.",
    "No. Also that's weird.",
    "I don't want to answer that.",
    "It's a coin flip...",
    "Sure thing.",
    "Positive.",
    "Go for it."
  ];
  return embedService.embed(msg, args, {
    argsTitle,
    description: responses[rngService.getRandomInt(0, responses.length, false)],
  });
};

const execute = (msg, args) => {
  embedMessage(msg, args);
}

const commandTemplate = {
  name: "8ball",
  description: "Answers questions.",
  execute: execute,
  config: null
}

export {
  commandTemplate
}