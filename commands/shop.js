const embedService = require("../services/embedService");
const db = require("../models").sequelize;
const userModel = db.models.User;
const fishermanModel = db.models.Fisherman;

const embed = (msg, args, user) => {
  const author = {
    name: `The Shop`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = true;
  const fields = [
    {
      name: "1. Nanotube fishing line",
      value: (!user.line?`**1500** :yen: \n+5 Base roll`:`:white_check_mark: You own this item`),
    },
    {
      name: "2. Lucky bait",
      value: (!user.bait?`**500** :yen: \nSlightly luckier rolls`:`:white_check_mark: You own this item`),
    },
    {
      name: "3. Reinforced boat",
      value: (!user.boat?`**10000** :yen: \nYour boat cant break`:`:white_check_mark: You own this item`),
    },
    {
      name: "\u200b",
      value: `Type !buy followed by the number of the object you wish to purchase`,
    },
  ];
  fields.forEach((field, i) => {
    fields[i].inline = true;
  });
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

const shop = async (msg, args) => {
  const authorId = msg.author.id;
  const [user] = await fishermanModel
    .findOrCreate({
      where: { discordId: authorId },
    })
    .catch((err) => {
      console.error(err);
    });
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, user);
};

module.exports = {
  name: "!shop",
  description:
    "Spend your :yen: here",
  execute(msg, args, options = {}) {
    shop(msg, args);
  },
};
