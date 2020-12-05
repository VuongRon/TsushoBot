const embedService = require("../services/embedService");
const db = require("../models").sequelize;
const userModel = db.models.User;
const mediaModel = db.models.Media;
const mime = require("mime-types");

const getIntention = (msg, args) =>
  args && args[0] === "add" ? addResource(msg, args) : getResource(msg, args);

const checkURL = (url) => {
  const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return pattern.test(url);
};

const checkResource = (resource) => {
  if (checkURL(resource)) return mime.lookup(resource);
};

const addResource = async (msg, args) => {
  const user = await userModel.findOrCreateByDiscordId(msg.author.id);
  const passedResource = args[1];
  const resourceExists = await mediaModel.findOneByMediaContent(passedResource);
  if (user.whitelisted && checkResource(passedResource) && !resourceExists) {
    await mediaModel
      .create({
        mediaContent: passedResource,
        requestedByUserId: user.discordId,
        commandName: "alk",
      })
      .catch((err) => {
        console.error(err);
        return;
      });
    const message = "Successfully added the resource for approval.";
    return embedService.embedMessage(msg, args, message);
  }
};

const getResource = (msg, args) => {
  
};

module.exports = {
  name: "!alk",
  description: "Posts a random Alkaizer.",
  execute(msg, args, options = {}) {
    getIntention(msg, args);
  },
};
