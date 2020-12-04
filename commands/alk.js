const embedService = require("../services/embedService");
const db = require("../models").sequelize;
const userModel = db.models.User;
const mediaModel = db.models.Media;

const getIntention = (msg, args) =>
  args && args[0] === "add" ? addResource(msg, args) : getResource(msg, args);

const addResource = (msg, args) => {
  console.log(`addResource args[0]: ${args[0]}`);
};

const getResource = (msg, args) => {
  console.log(`getResource args[0]: ${args[0]}`);
};

module.exports = {
  name: "!alk",
  description: "Posts a random Alkaizer.",
  execute(msg, args, options = {}) {
    getIntention(msg, args);
  },
};
