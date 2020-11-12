const numbers = require("numbers");

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
  const responses = [
    " your stats are:",
    "",
    `${getLooks()}/10 looks.`,
    `${getIQ()} IQ.`,
    `${getMMR()} MMR.`,
    `$${getSalary()
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} salary.`,
    `${getLength()} inches.`,
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
