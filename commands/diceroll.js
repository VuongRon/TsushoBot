const embedService = require("../services/embedService");
const DiceGame = require("./classes/Dice").Dice;

const embedMessage = (msg, args, options) => {
  let diceConstants = options.constants.diceroll;

  // By default, the game should have 10000 points required to finish the current round
  // Configure as you like in /constants/diceroll.json
  let totalPointsRequired = options.constants.diceroll.pointsRequired;
  let dice = new DiceGame(diceConstants);

  // Perform a new roll
  let result = dice.roll();

  // Increase the global points
  DiceGame.points += dice.amountOfPointsThisRound;

  // Once we hit the requirement, the game restarts
  let messageHeader = "";
  if (DiceGame.points >= totalPointsRequired) {
    // Indicate that we have finished the game and print the winner
    DiceGame.gameFinished = true;

    messageHeader = `${msg.author.username} has won the game!\n\n`;
  }

  return embedService.embed(msg, args, {
    description:  `${messageHeader}` +
                  `Total points: ${DiceGame.points}\n\n` + 
                  `Your numbers: ${dice.diceRolls}\n` +
                  `Rolled ${result.message}: +${result.points} points`,
  });
};

module.exports = {
  name: "!diceroll",
  description: "Dice 10000 played differently.",
  execute(msg, args, options = {}) {
    embedMessage(msg, args, options);
  },
};
