const embedService = require("../services/embedService");
const db = require("../models").sequelize;

const fishermanModel = db.models.Fisherman;

const embed = (msg, args, valueOfInf) => {
  const argsTitle = true;
  const fields = [
    {
      name: `You sold all your fish for **${valueOfInf}** :yen:`,
      value: "Dont go spend it all in one place!",
    },
  ];
  fields.forEach((field, i) => {
    fields[i].inline = true;
  });
  return embedService.embed(msg, args, {
    argsTitle,
    fields,
  });
};

const selling = async (msg, args) => {
  const authorId = msg.author.id;
  const [user] = await fishermanModel
    .findOrCreate({
      where: { discordId: authorId },
    })
    .catch((err) => {
      console.error(err);
    });
    let valueOfInf = user.sellInventory();
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, valueOfInf);
};

module.exports = {
  name: "!sell",
  description:
    "Sells your fish inventory for :yen:",
  execute(msg, args, options = {}) {
    selling(msg, args);
  },
};
