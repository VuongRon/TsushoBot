import { sequelize, selectRandomFromCommand } from "../models";
import { embedMessage } from "../services/embedService";

const getResource = async (msg, args) => {
  const resource = await selectRandomFromCommand("alk", sequelize).catch(err => console.error(err));
  if (!resource) {
    return null; /** TODO */
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

module.exports = {
  name: "!alk",
  description: "Posts a random Alkaizer.",
  execute(msg, args, options = {}) {
    getResource(msg, args);
  },
};
