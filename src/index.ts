import { config } from "dotenv";
config();

import { Intents, Interaction } from "discord.js";
import { CommandResponse, ExtendedClient } from "./types/discord-types.type";
import { botCommands } from "./commands";
import { Command } from "./types/command.type";

// Send our bot commands to the client
const client = new ExtendedClient(
  {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  },
  botCommands
);

client.on("interactionCreate", async (interaction: Interaction) => {
  // Do nothing if this interaction is not a CommandInteraction type
  // TODO: this should probably reply to the interaction anyway.
  //       Needs testing if other types of Interactions are introduced. Ignore otherwise and remove TODO.
  // Can throw InvalidCommandInteractionException()
  if (!interaction.isCommand()) return;

  const command: Command | undefined = botCommands.get(interaction.commandName);

  // We have to make sure that command we are trying to execute was actually
  // imported into botCommands collection
  if (!command) {
    console.error(`The '${interaction.commandName}' command was not imported.`);
  }
  let commandResponse: CommandResponse;
  try {
    // Attempt to execute the given command and fetch the response
    commandResponse = command?.execute(interaction);
  } catch (error: unknown) {
    // If something went wrong while fetching the command response, an error should be thrown internally
    // and reported here.

    // TODO: Add some form of exception logging either further review, e.g. to the Database/File
    console.error(error);
  } finally {
    // We have to do something with the response anyway, so we either have to reply to the
    // interaction with the command execution results or with an error message if something goes wrong
    commandResponse = commandResponse ?? "Sorry, this command could not be executed at this time.";
  }

  // Reply and catch potential internal errors
  await interaction.reply(commandResponse).catch(console.error);
});

/**
 * messageCreate event was previously used to handle text command handler.
 *
 *
 *
 */
// client.on("messageCreate", async (msg: Message) => {
//   /**
//    * Don't process bot messages, could be even more specific to ignore self messages.
//    */
//   if (msg.author.bot) {
//     return;
//   }

//   const args: string[] = msg.content.split(/ +/);
//   const command: string = args.shift()!.toLowerCase().substr(1);
//   const options: any = {};

//   // Abort if the command string sent to the chat is not a command defined in this bot
//   if (!client.commands.has(command)) return;

//   const commandInstance = client.commands.get(command);
//   /**
//    * Check if command instance exists in given key index
//    */
//   if (!commandInstance) return;

//   try {
//     console.log(`called command: !${commandInstance.name}`);
//     if (command == "help") options.commands = client.commands;
//     commandInstance.execute(msg, args, options);
//   } catch (error) {
//     console.error(error);
//     msg.reply("Something broke and that last command did not work.");
//   }
// });

const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  client.user ? console.log(`Logged in as ${client.user.tag}!`) : console.log(`Logged in without defined user`);
});

client.login(TOKEN);
