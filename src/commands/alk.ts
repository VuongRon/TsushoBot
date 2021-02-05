import { Message } from "discord.js";
import { sequelize, MediaModule } from "../models";
import { embedMessage } from "../services/embedService";
import { CommandTemplate } from "../types/command.type";

const getResource = async (msg, args) => {
  const resource = await MediaModule.selectRandomFromCommand("alk", sequelize).catch(err => console.error(err));
  if (!resource) {
    return; /** TODO */
  }
  return msg.channel.send(resource.mediaContent).catch(async (err) => {
    console.error(err);
    await resource.destroy().catch((error) => {
      console.error(error);
      return;
    });
    const msg = `Encountered an invalid resource - it has now been removed.`;
    return embedMessage(msg, args, msg);
  });
};

const execute = (msg: Message, args: string[]) => {
  getResource(msg, args);
}

const commandTemplate: CommandTemplate<null> = {
  name: "alk",
  description: "Posts a random Alkaizer.",
  execute: execute,
  config: null
}

export {
  commandTemplate
}
