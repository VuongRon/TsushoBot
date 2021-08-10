import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ApplicationCommandOptionData } from "discord.js";
import { CommandCollection } from "../types/command.type";
const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;
let rest: REST;
if (token) {
  rest = new REST({ version: "9" }).setToken(token);
}

type CommandBody = {
  name: string;
  description: string;
  options: ApplicationCommandOptionData[] | undefined;
};

const registerCommands = async (commands: CommandCollection) => {
  if (guildId && clientId) {
    let bodyCommands: CommandBody[] = new Array();
    commands.forEach(({ name, description, options }) => {
      bodyCommands.push({
        name,
        description,
        options,
      });
    });
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: bodyCommands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }
};

export { registerCommands };
