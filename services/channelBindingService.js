/**
   * Channel binding Template.
   * 
   * Require as require("./path").ChannelBinding;
   *
   * This service requires the channel bindings to be defined 
   * in the .env as following:
   * CHANNEL_BINDING_COMMAND_NAME = discord_channel_id
   * 
   * Separate the channel ids by commas if that command belongs in multiple channels:
   * CHANNEL_BINDING_COINFLIP = 12345,67890
   * 
   * @param   {objectg}   msg      Discord Message Object
   * @param   {string}    command  Command name
   */
class ChannelBinding {
  constructor(msg, command) {
    /**
     * ID of the channel where this message has been sent in.
     * Channel ID comes from Discord message as a string
     *
     * @var {string}
     */
    this.channelId = msg.channel.id;

    /**
     * Main command name executed by the user.
     * Command name comes with the exclamation mark - we have to remove it.
     * We only need this name to match the .env channel binding.
     *
     * @var {string}
     */
    this.commandName = command.slice(1).toUpperCase();

    /**
     * String partial to match during the binding lookup.
     * Environment bindings should follow this convention
     *
     * @var {string}
     */
    this.envCommandPart = "CHANNEL_BINDING_";

    /**
     * Array of .env channel bindings (channel id/ids) populated during the construction
     *
     * @var {array}
     */
    this.channelBindings = this.getBinding();
  }

  /**
   * Extracts the channel binding from .env for the specific command
   *
   * @return  {array}
   */
  getBinding = () => {
    let options = Object.keys(process.env);
    let bindings = [];
    let optionComparison = this.envCommandPart + this.commandName;

    // Extract the option matching the channel binding string partial
    options.forEach((option) => {
      // Ignore the mismatch
      if (option != optionComparison) {
        return;
      }

      // Get the .env channel binding value
      let binding = process.env[option];

      // Check if this command can be bound to many channels
      if (binding.includes(",") === true) {
        let channelIDs = binding.split(",");

        // Multi-channel binding, add all channel IDs
        channelIDs.forEach((id) => {
          bindings.push(id);
        });
      } else {
        // Single-channel binding
        bindings.push(binding);
      }
    });

    return bindings;
  }

  /**
   * Check if the channel ID of the incoming message exists in the extracted bindings
   * Returns true if there are no bindings or if there was no mismatch
   *
   * @return  {bool}
   */
  belongsToThisChannel = () => {
    /**
     * Ignore if the specified command does not have any channel bindings specified.
     * This means the command was not instructed to use the channel binding, thus accepted
     * 
     * We have to return true if there were no bindings found in the environment, because we
     * we should interrupt the execution __only__ if the binding was found and channel IDs mismatch.
     * It is ideal to only specify bindings in the environment if the command has to belong to specific channels
     */
    if (this.channelBindings.length == 0) {
      return true;
    }

    // Having the bindings specified, we have to check if this command exists in the bindings
    // (belongs to the "whitelist")
    if (this.channelBindings.includes(this.channelId) === false) {
      return false;
    }

    // Accept otherwise
    return true;
  }

}

module.exports = {
  ChannelBinding,
};
