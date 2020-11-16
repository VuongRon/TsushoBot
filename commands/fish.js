const embedService = require("../services/embedService");
const rngService = require("../services/rngService");
const talkedRecently = new Set();

const generateRoll = () => {
  return rngService.normalDistribution(50, 25);
};

function getFish(roll) {
  if (roll < -5) {
    return ["You caught a :motorized_wheelchair:!", "2fast2furious"];
  } else if (roll < 0) {
    return ["You caught a :manual_wheelchair:!", ":fire:"];
  } else if (roll < 10) {
    return ["You caught my :heart:!", ":flushed:"];
  } else if (roll < 25) {
    return ["You caught nothing!", "Unlucky"];
  } else if (roll >= 100) {
    return ["You caught a :blowfish:!", "INSANE!"];
  } else if (roll >= 90) {
    return ["You caught a :tropical_fish:!", "Pog!"];
  } else if (roll >= 75) {
    return ["You caught a :fish:!", "nice"];
  } else if (roll >= 50) {
    return ["You caught a :boot:!", "It's brand new"];
  } else if (roll >= 25) {
    return ["You caught a :wrench:!", "Maybe someone else can use it"];
  }
}

const embedMessage = (msg, args) => {
  const fish = getFish(generateRoll());
  const author = {
    name: `${msg.author.username} is fishing...`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = true;
  const fields = [
    {
      name: `${fish[0]}`,
      value: `${fish[1]}`,
      inline: true,
    },
  ];
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

module.exports = {
  name: "!fish",
  description: "Yeah, I fish.",
  execute(msg, args, options = {}) {
    if (!talkedRecently.has(msg.author.id)) {
      embedMessage(msg, args);
      talkedRecently.add(msg.author.id);
      setTimeout(() => {
        talkedRecently.delete(msg.author.id);
      }, 3500);
    }
  },
};
