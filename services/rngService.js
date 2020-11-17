const numbers = require("numbers");

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

const checkIfNegative = (value) => {
  return value <= 0 ? 0 : value;
};

const normalDistribution = (mean, stdev, modifier = 1, checkNegative = false) => {
  if (checkNegative) {
    return checkIfNegative(Math.floor(
      parseInt(
        getRandomValue(mean, stdev, numbers.random.distribution.normal) *
        modifier,
        10
      )
    ));
  } else {
    return Math.floor(
      parseInt(
        getRandomValue(mean, stdev, numbers.random.distribution.normal) *
        modifier,
        10
      )
    );
  }
};

const logNormalDistribution = (mean, stdev, modifier = 1, checkNegative = false) => {
  if (checkNegative) {
    return checkIfNegative(Math.floor(
      parseInt(
        getRandomValue(mean, stdev, numbers.random.distribution.logNormal) *
        modifier,
        10
      )
    ));
  } else {
    return Math.floor(
      parseInt(
        getRandomValue(mean, stdev, numbers.random.distribution.logNormal) *
        modifier,
        10
      )
    );
  }
};

module.exports = {
  normalDistribution,
  logNormalDistribution,
};
