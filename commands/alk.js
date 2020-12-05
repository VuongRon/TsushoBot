const db = require("../models").sequelize;
const mediaModel = db.models.Media;

const getResource = async (msg) => {
  const resource = await mediaModel
    .selectRandomFromCommand("alk")
    .catch((err) => console.error(err));
  return msg.channel
    .send(resource.mediaContent)
    .catch((err) => console.error(err));
};

module.exports = {
  name: "!alk",
  description: "Posts a random Alkaizer.",
  execute(msg, args, options = {}) {
    getResource(msg);
  },
};
