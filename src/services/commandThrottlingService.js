/**
 * Command Throttling defines the cooldown and for each command __for each user__
 * The same command can be executed by many users - later handled by Discord - 
 * but the same command can not be executed by the same user multiple times
 * until the cooldown ends.
 *
 * Ideally the command should have a cooldown set to > 0 (integer) or it will have no effect
 * on this command at all - it won't be throttled since the 0-cooldown will make it
 * immediately available anyway and 0.5s cooldown makes no sense ¯\_(ツ)_/¯
 */
class CommandThrottling {
  static currentThrottles = {};

  /**
   * Returns the remaining cooldown in seconds for the current command / user
   *
   * @param   {string}  command  Executed command
   * @param   {string}  user     Message owner
   *
   * @return  {float}
   */
  static getRemainingCooldown = (command, user) => {
    const cooldown = CommandThrottling.currentThrottles[command][user];

    // The command should exist. Return zero if it's not defined
    if (cooldown === undefined) {
      return 0;
    }

    return (cooldown - Date.now()) / 1000;
  }

  /**
   * @param   {string}  command  Command name
   * @param   {string}  owner    Username
   */
  constructor(command, owner) {
    /**
     * Executed command name. Already processed by Channel Binding as
     * command name without exclamation mark
     *
     * @var {string}
     */
    this.command = command;

    /**
     * Discord user that executed this command
     *
     * @var {string}
     */
    this.messageOwner = owner;

    /**
     * String partial to match during the command lookup.
     * Environment bindings should follow this convention
     *
     * @var {string}
     */
    this.envCommandPart = "COMMAND_THROTTLING_";

    /**
     * Combination of <envCommandPart> and <command>
     *
     * @var {string}
     */
    this.envCommandDefinition;

    /**
     * Object of commands defined in the .env that have to be throttled
     *
     * @var {object}
     */
    this.commandsToThrottle = this.fetchCommandsToThrottle();
  }

  /**
   * Extract the commands to throttle
   *
   * @return  {object}
   */
  fetchCommandsToThrottle = () => {
    const options = Object.keys(process.env);
    let commands = {};
    this.envCommandDefinition = this.envCommandPart + this.command;
    
    options.forEach((option) => {
      // Ignore the mismatch
      if (option != this.envCommandDefinition) {
        return;
      }

      // Get the defined .env command throttling
      // Matching COMMAND_THROTTLING_<command_name>
      let throttling = parseInt(process.env[option], 10);
      
      // Ignore if, for some reason, the throttling had no time specified,
      // is NaN or undefined. To apply command throttling properly, we can only
      // accept numbers
      if (isNaN(throttling) === true) {
        return;
      }

      // The command has been defined correctly, add it to the list
      commands[option] = { cooldown: throttling };
    });

    return commands;
  }

  /**
   * Checks if the current command has throttling defined in the .env
   * We already have a list of commands from the constructor, so we only have
   * to check for the presence in the class field
   *
   * @return  {boolean}
   */
  canBeThrottled = () => {
    return this.commandsToThrottle[this.envCommandDefinition.toUpperCase()] !== undefined
  }

  /**
   * Checks if the current command exists on the list of currently throttled
   * commands under the key of the owner of this message.
   * If it exists, checks if its cooldown has ended for this user
   *
   * @return  {boolean}
   */
  isOnCooldown = () => {
    let throttledCommand = CommandThrottling.currentThrottles[this.command];

    // The user is allowed to execute this command if it's not on the list yet
    if (throttledCommand === undefined) {
      return false;
    }

    // We have to check if it's on cooldown for the current user
    // If it's still on cooldown, we will reject the execution
    let cooldown = throttledCommand[this.messageOwner];
    let time = Date.now();
    if ((cooldown - time) > 0) {
      return true;
    }

    // The negative cooldown means we are good to go, we can remove the
    // current user from the list in this command
    delete throttledCommand[this.messageOwner];

    // NOTICE: we can leave the command on the list as it will get overwritten
    return false;
  }

  /**
   * Add this command to the list and set a cooldown for the message owner
   * to prevent the command execution
   *
   * @return  {void}
   */
  throttleCommand = () => {
    // Get the command cooldown we fetched earlier from the .env
    // Convert the cooldown to milliseconds and add it to the current time
    let commandCooldown = Date.now() + this.commandsToThrottle[this.envCommandDefinition].cooldown * 1000;

    // Set a cooldown for this command for the current user
    CommandThrottling.currentThrottles[this.command] = { [this.messageOwner]: commandCooldown };
  }

  /**
   * Checks if the command is currently throttled. If the command can not be 
   * executed by this user at the moment, we will ignore the execution to not 
   * clog the queue, so other users are able to use this/other commands.
   *
   * @return  {boolean}
   */
  canBeExecuted = () => {
    // If there was no throttling defined, ignore
    if (this.canBeThrottled() === false) {
      return true;
    }

    // Reject the command execution if this command is on cooldown
    if (this.isOnCooldown() === true) {
      return false;
    }

    // If this command is not currently throttled and is not on cooldown for
    // this user, add it to the list / overwrite it
    this.throttleCommand();
    return true;
  }
}

module.exports = {
  CommandThrottling,
};
