const numbers = require("numbers");
const embedService = require("../services/embedService");
const talkedRecently = new Set();

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

const checkArgsLength = (args) => {
  args = args.join(" ");
  let maxLength = 100;
  return args.length > maxLength
    ? args.substring(0, maxLength - 3) + "..."
    : args;
};

const generateRoll = () => {
  return Math.floor(
    parseInt(getRandomValue(50, 25, numbers.random.distribution.normal), 10)
  );
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
  const title = `${args ? checkArgsLength(args) : ""}`;
  const fields = [
    {
      name: `${fish[0]}`,
      value: `${fish[1]}`,
      inline: true,
    },
  ];
  return embedService.embed(msg, {
    author,
    title,
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
