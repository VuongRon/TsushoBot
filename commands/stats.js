const embedService = require("../services/embedService");
const rngService = require("../services/rngService");
const MultivariateNormal = require("multivariate-normal").default;

const getIQ = () => {
  return rngService.normalDistribution(100, 100 / 3);
};

const getLooks = () => {
  return rngService.normalDistribution(5, 5 / 3);
};

const getMMR = () => {
  return rngService.normalDistribution(5000, 5000 / 3, 1, true);
};

const getSalary = () => {
  return rngService.logNormalDistribution(1, 1, 50000);
};

const getLength = () => {
  const randomInches = rngService.normalDistribution(6, 6 / 3, 1, true);
  return `${randomInches} in (${Math.round(randomInches * 2.54)} cm)`;
};

const generateSample = () => {
  const meanVector = [170, 70];

  const covarianceMatrix = [
    [450, 370],
    [370, 350],
  ];

  const distribution = MultivariateNormal(meanVector, covarianceMatrix);
  return distribution.sample();
};

const getHeight = (sample) => {
  const height = Math.round(sample[0]);
  const inches = Math.round(height / 2.54);
  return `${Math.floor(inches / 12)}'${inches % 12}" (${height} cm)`;
};

const getWeight = (sample) => {
  const weight = Math.round(sample[1]);
  return `${Math.round(weight * 2.205)} lb (${weight} kg)`;
};

const embedMessage = (msg, args) => {
  const argsTitle = true;
  const sample = generateSample();
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
      value: `${getHeight(sample)}`,
    },
    {
      name: ":scales: Weight",
      value: `${getWeight(sample)}`,
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
