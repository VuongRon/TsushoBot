const embedService = require("../services/embedService");
const db = require("../models").sequelize;
const userModel = db.models.User;
const mediaModel = db.models.Media;
const mime = require("mime-types");
const axios = require("axios").default;

const getIntention = (msg, args) =>
  args && args[0] === "add" && args[1]
    ? addResource(msg, args)
    : getResource(msg, args);

const URLExists = async (url) => {
  try {
    await axios.head(url);
    return true;
  } catch {
    return false;
  }
};

const checkURL = (url) => {
  const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return pattern.test(url);
};

const checkResource = async (resource) => {
  const exists = await URLExists(resource);
  if (checkURL(resource) && exists) {
    return mime.lookup(resource);
  }
};

const addResource = async (msg, args) => {
  const user = await userModel.findOrCreateByDiscordId(msg.author.id);
  const passedResource = args[1];
  if (user.whitelisted) {
    const resourceExists = await mediaModel.findOneByMediaContent(
      passedResource
    );
    const resourceValid = await checkResource(passedResource);
    if (resourceValid && !resourceExists) {
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
    } else {
      const message = "The resource cannot be added.";
      return embedService.embedMessage(msg, args, message);
    }
  }
};

const getResource = (msg, args) => {};

module.exports = {
  name: "!alk",
  description: "Posts a random Alkaizer.",
  execute(msg, args, options = {}) {
    getIntention(msg, args);
  },
};
