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
     * Main command name executed by the user
     *
     * @var {string}
     */
    this.commandName = command;
  }

  /**
   * If this command exists in the channel bindings, check if the message channel ID 
   * matches the specification
   *
   * @return  {bool}
   */
  belongsToThisChannel = () => {
    // Get binding of the executed command
    let binding = config.channelBindings[this.commandName];

    // Ignore if the specified command does not exist in the channel bindings
    // This means the command was not instructed to use the channel binding
    if (typeof binding === "undefined") {
      return true;
    }

    // We have to check if this command has been bound to many channels
    if (binding.includes(",") === true) {
      let channelIDs = binding.split(",");

      return channelIDs.includes(this.channelId);
    }

    // Compare against a single channel id if the binding was not an array
    return (this.channelId == binding);
  }
}

module.exports = {
  ChannelBinding,
};
