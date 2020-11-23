const numbers = require("numbers");

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

const getRandomInt = (min, max, maxInclusive = false) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return maxInclusive
    ? Math.floor(Math.random() * (max - min + 1) + min)
    : Math.floor(Math.random() * (max - min) + min);
};

/**
 * Returns a random object from a weighted list
 *
 * Requires each object in the array to have a `.weight` property
 * @param {Array} arr Array of objects, e.g. [{ value: '1', weight: 10 }, { value: '2', weight: 2 }, ...]
 * @return {Object} A random `object` from the passed array
 */
const getWeightedRandom = (arr) => {
  let total = 1;
  arr.forEach((object) => {
    total += object.weight;
  });

  const threshold = getRandomInt(0, total);

  total = 0;
  for (const object of arr) {
    total += object.weight;
    if (total >= threshold) return object;
  }
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
  getRandomInt,
  getWeightedRandom,
};
