const numbers = require("numbers");
const stringTable = require("string-table");

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
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
  return Math.floor(
    parseInt(getRandomValue(6, 6 / 3, numbers.random.distribution.normal), 10)
  );
};

const getStats = (msg) => {
  const stats = [
    {
      Looks: `${getLooks()}/10`,
      IQ: getIQ(),
      MMR: getMMR(),
      Salary: `$${getSalary()
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      Length: `${getLength()} in`,
    },
  ];
  const responses = [
    "your stats are:",
    `\`\`\`${stringTable.create(stats)}\`\`\``,
  ];
  return msg.reply(responses.join("\n"));
};

module.exports = {
  name: "!stats",
  description: "Your stats.",
  execute(msg, args) {
    getStats(msg);
  },
};
