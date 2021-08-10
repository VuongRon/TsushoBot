import { config } from "dotenv";
config();

import { Intents, Interaction, MessageEmbedOptions } from "discord.js";
import { ExtendedClient } from "./types/discord-types.type";
import { botCommands } from "./commands";
import { Command } from "./types/command.type";
import { EmbedBuilder } from "./services/EmbedBuilder";

// Send our bot commands to the client
const client = new ExtendedClient(
  {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  },
  botCommands
);

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  // Since Interaction already outputs a semi-response in the chat, we have to
  // Reply to the interaction with a fallback embed in case the command does not
  // exist in the collection - was not imported, etc.
  const command: Command | undefined = botCommands.get(interaction.commandName);

  // Resolve to Fallback Embed Response if the command did not exist in the collection
  // We handle both Single and Multiple embeds in case this command has to embed
  // multiple messages in form of split sections
  const embedResponse: MessageEmbedOptions | MessageEmbedOptions[] =
    command?.embed(interaction) ?? EmbedBuilder.fallbackEmbed();

  interaction.reply({ embeds: [embedResponse] });

  //if (interaction.commandName === "ping") {
  //  await interaction.reply("Pong!");
  //}
});

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
