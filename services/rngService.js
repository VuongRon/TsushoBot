const numbers = require("numbers");

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  // Both the maximum and minimum are inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const checkIfNegative = (value) => {
  return value <= 0 ? 0 : value;
};

const normalDistribution = (
  mean,
  stdev,
  modifier = 1,
  checkNegative = false
) => {
  const value = Math.floor(
    parseInt(
      getRandomValue(mean, stdev, numbers.random.distribution.normal) *
        modifier,
      10
    )
  );
  return checkNegative ? checkIfNegative(value) : value;
};

const logNormalDistribution = (
  mean,
  stdev,
  modifier = 1,
  checkNegative = false
) => {
  const value = Math.floor(
    parseInt(
      getRandomValue(mean, stdev, numbers.random.distribution.logNormal) *
        modifier,
      10
    )
  );
  return checkNegative ? checkIfNegative(value) : value;
};

module.exports = {
  normalDistribution,
  logNormalDistribution,
};
