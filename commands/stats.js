const embedService = require("../services/embedService");
const rngService = require("../services/rngService");

const getIQ = () => {
  return rngService.normalDistribution(100, 100 / 3);
};

const getLooks = () => {
  return rngService.normalDistribution(5, 5 / 3);
};

const getMMR = () => {
  return rngService.normalDistribution(5000, 5000 / 3);
};

const getSalary = () => {
  return rngService.logNormalDistribution(1, 1, 50000);
};

const getLength = () => {
  const randomInches = rngService.normalDistribution(6, 6 / 3);
  return `${randomInches} in (${Math.floor(randomInches * 2.54)} cm)`;
};

const getHeight = () => {
  const randomInches = rngService.normalDistribution(67, 67 / 3);
  return `${Math.floor(randomInches / 12)}'${Math.floor(
    randomInches % 12
  )}" (${Math.floor(randomInches * 2.54)} cm)`;
};

const getWeight = () => {
  const randomPounds = rngService.normalDistribution(175, 175 / 3);
  return `${randomPounds} lb (${Math.floor(randomPounds / 2.205)} kg)`;
};

const embedMessage = (msg, args) => {
  const argsTitle = true;
  const fields = [
    {
      name: ":eyes: Looks",
      value: `${getLooks()}/10`,
    },
    {
      name: ":brain: IQ",
      value: `${getIQ()}`,
    },
    {
      name: ":video_game: MMR",
      value: `${getMMR()}`,
    },
    {
      name: ":moneybag: Salary",
      value: `$${getSalary()
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    },
    {
      name: ":pinching_hand: Length",
      value: `${getLength()}`,
    },
    {
      name: ":straight_ruler: Height",
      value: `${getHeight()}`,
    },
    {
      name: ":scales: Weight",
      value: `${getWeight()}`,
    },
  ];
  fields.forEach((field, i) => {
    fields[i].inline = true;
  });
  return embedService.embed(msg, args, {
    argsTitle,
    fields,
  });
};

module.exports = {
  name: "!stats",
  description:
    "Shows your randomized stats. Each stat is normally distributed.",
  execute(msg, args, options = {}) {
    embedMessage(msg, args);
  },
};
