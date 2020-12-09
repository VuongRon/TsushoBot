const rngService = require("../../services/rngService");
const _ = require("lodash");

/**
 * Super-simplified Dice 1000 game (extended to 10000)
 * A DB-less mini-game.
 * 
 * @var {object}
 */
class Dice {
  /**
   * Total game points in the current round. This value will be updated with each roll
   * as long as the bot is running.
   *
   * @var {integer}
   */
  static points = 0;

  /**
   * If this flag is set to true, the points will be reset
   *
   * @var {bool}
   */
  static gameFinished = false;

  /**
   * @param   {object}  constants  Dice Constants (options.constants.dice)
   */
  constructor(constants) {
    /**
     * Contains points rewarded for certain rolls
     *
     * @var {Object}
     */
    this.pointsTable = constants.points;

    /**
     * Messages partials for __special__ rolls
     *
     * @var {object}
     */
    this.messages = constants.messages;

    /**
     * Stores the result of a dice roll
     * 
     * @var {array}
     */
    this.diceRolls = [,,,,,];
  
    /**
     * Amount of points in the current roll executed by the player.
     * Adds to the total, used in the Embed
     * 
     * @var {integer}
     */
    this.amountOfPointsThisRound = 0;

    /**
     * A partial appended to the final message when user rolls a special (something other
     * than just Ones/Fives/Nothing)
     *
     * @var {string}
     */
    this.rollMessage = "";
  }

  /**
   * Rolls the dice five times and stores the roll values
   *
   * @return  {object}
   */
  roll = () => {
    // Reset the points if the game has been finished
    if (Dice.gameFinished === true) {
      Dice.points = 0;
      Dice.gameFinished = false;
    }

    // __We only need the index number__
    for (const [index] of this.diceRolls.entries()) {
      // "Roll" the dice
      let number = rngService.getRandomInt(1, 6);
      this.diceRolls[index] = number;
    }

    // Sort the outcomes, ascending
    this.diceRolls.sort();

    // We have to walk through the rules from the most to least rewarding
    // and the first applied rule has to break further checks
    for (const rule in this.rules) {
      // We have to ignore the extracted methods as they are not used in the game rules validation
      if (rule === "isStraight" || rule === "countOccurrences") {
        continue;
      }

      // If this current rule has met its condition, we have to abort the
      // further execution and return the embed message
      let ruleApplied = this.rules[rule]();

      if (ruleApplied === true) {
        break;
      }
    }

    return {
      message: `${this.rollMessage}`,
      points : this.amountOfPointsThisRound,
    }
  }

  /**
   * Basic rules excluding detailed conditions (555 pts, tank, etc)
   * 
   * @var {object}
   */
  rules = {
    /**
     * Checks if the dice rolls form a Straight
     * This rule applies to both Low and High Straights
     * 
     * @param   {string}    message   Message of the special roll (Low Straight / High Straight)
     * @param   {integer}   points    Amount of points awarded for this special roll
     * 
     * @return  {bool}
     */
    isStraight: (message, points) => {
      // Break and abort if the next number is not greater than 1
      // This means the same number or greater than 2 will not form a Straight
      for (const [index, number] of this.diceRolls.entries()) {
        let nextNumber = this.diceRolls[index + 1];
        if ( (nextNumber - number) !== 1 ) {
          return false;
        }
      }

      this.rollMessage             = message;
      this.amountOfPointsThisRound = points;

      // If all rolls formed a High Straight, inform that we have met
      // the conditions for this rule, therefore aborting further rule checks
      return true;
    },

    /**
     * Checks if there is a required amount of occurrences of at least one element
     * of the given array of elements
     *
     * @param   {integer}   occurrencesRequired  Required amount of occurrences of at least one element
     * @param   {string}    message              Message of the special roll (Low Straight / High Straight)
     * @param   {integer}   points               Amount of points awarded for this special roll
     *
     * @return  {bool}
     */
    countOccurrences: (occurrencesRequired, message, points) => {
      // There can only be one `Three of a Kind` / `Four` or a Flush, so we can break after the first occurrence
      let numberCounts = _.countBy(this.diceRolls);

      for (const count in numberCounts) {
        if (numberCounts[count] === occurrencesRequired) {
          this.rollMessage = message;
          this.amountOfPointsThisRound = points;

          return true;
        }
      }

      return false;
    },

    /**
     * Checks if there is a combination of 5 same numbers in the rolls
     *
     * @return  {bool}
     */
    isFlush: () => {
      return this.rules.countOccurrences(
        5,
        this.messages.flush,
        this.pointsTable.flush
      );
    },

    /**
     * High Straight starts from 2. If the first roll is a different number,
     * abort and go to the next rule
     *
     * @return  {bool}
     */
    isStraightHigh: () => {
      // Continue only if the first roll is 2
      if (this.diceRolls[0] !== 2) {
        return false;
      }

      return this.rules.isStraight(
        this.messages.straight_high,
        this.pointsTable.straight_high
      );
    },

    /**
     * Low Straight starts from 1. If the first roll is a different number,
     * abort and go to the next rule
     *
     * @return  {bool}
     */
    isStraightLow: () => {
      // Continue only if the first roll is 1
      if (this.diceRolls[0] !== 1) {
        return false;
      }

      return this.rules.isStraight(
        this.messages.straight_low,
        this.pointsTable.straight_low
      );
    },

    /**
     * Full House
     *
     * @return  {bool}
     */
    isFullHouse: () => {
      // TODO

      return false;
    },

    /**
     * Checks if there was a quadruple repeat of one roll
     *
     * @return  {bool}
     */
    isFourOfAKind: () => {
      return this.rules.countOccurrences(
        4,
        this.messages.four_of_a_kind,
        this.pointsTable.four_of_a_kind
      );
    },

    /**
     * Checks if there was a triple repeat of one roll.
     * This has to be checked after Full House, because it also contains
     * Three of a Kind with an addition of a pair, so we could lose points
     * if we checked this rule as first.
     *
     * @return  {bool}
     */
    isThreeOfAKind: () => {
      return this.rules.countOccurrences(
        3,
        this.messages.three_of_a_kind,
        this.pointsTable.three_of_a_kind
      );
    },

    /**
     * The msot basic rule, checks if the rolls have 1 or 5.
     * Each '1' is worth 10 points, a '5' is worth 5 points
     * 
     * There will be no return value, because we are not displaying a
     * special message for higher combinations
     * 
     * @return  {bool}
     */
    hasOneOrFive: () => {
      let foundNumbers = false;

      for (const number of this.diceRolls) {
        if (number === 1) {
          this.amountOfPointsThisRound += this.pointsTable.one;
          foundNumbers = true;
        } else if ( number === 5) {
          this.amountOfPointsThisRound += this.pointsTable.five;
          foundNumbers = true;
        }
      }

      // If we ever get to this point, we have to display a generic roll message
      this.rollMessage = this.messages.nothing;

      return foundNumbers;
    }
  }
}

module.exports = {
  Dice,
}
