const numbers = require("numbers");
const embedService = require("../services/embedService");

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

const getIQ = () => {
  return Math.floor(
    parseInt(
      getRandomValue(100, 100 / 3, numbers.random.distribution.normal),
      10
    )
  );
};

const getLooks = () => {
  return Math.floor(
    parseInt(getRandomValue(5, 5 / 3, numbers.random.distribution.normal), 10)
  );
};

const getMMR = () => {
  return Math.floor(
    parseInt(
      getRandomValue(5000, 5000 / 3, numbers.random.distribution.normal),
      10
    )
  );
};

const getSalary = () => {
  return Math.floor(
    parseInt(
      getRandomValue(1, 1, numbers.random.distribution.logNormal) * 50000,
      10
    )
  );
};

const getLength = () => {
  const randomInches = Math.floor(
    parseInt(getRandomValue(6, 6 / 3, numbers.random.distribution.normal), 10)
  );
  return `${randomInches} in (${Math.floor(randomInches * 2.54)} cm)`;
};

const getHeight = () => {
  const randomInches = Math.floor(
    parseInt(getRandomValue(67, 67 / 5, numbers.random.distribution.normal), 10)
  );
  return `${Math.floor(randomInches / 12)}'${Math.floor(
    randomInches % 12
  )}" (${Math.floor(randomInches * 2.54)} cm)`;
};

const getWeight = () => {
  const randomPounds = Math.floor(
    parseInt(
      getRandomValue(175, 175 / 3, numbers.random.distribution.normal),
      10
    )
  );
  return `${randomPounds} lb (${Math.floor(randomPounds / 2.205)} kg)`;
};

const embedMessage = (msg, args) => {
  const title = `${args ? checkArgsLength(args) : ""}`;
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
  return embedService.embed(msg, {
    title,
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
