/**
 * Channel Binding definitions.
 * Binds the command name to channel IDs.
 *
 * Define channel ID in the .environment. Separate the channel IDs by commas if the command can
 * be executed in many channels.
 * 
 * Define new bindings as following:
 *  "!coinflip": process.env.BINDING_COINFLIP
 * 
 * Should be used only if the specified command has to be bound to one/multiple channels
 * 
 * @var {object}    Object of command bindings - access with channelBinding["command_name"]
 */
const channelBindings = {
    
};

module.exports = {
    channelBindings,
}
