const embedService = require("../services/embedService");
const db = require("../models").sequelize;
const userModel = db.models.User;
const fishermanModel = db.models.Fisherman;

const embed = (msg, args, user, item, transaction) => {
  const author = {
    name: `${msg.author.username} is purchasing an item`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = false;
  var fields;
  if(transaction){
    switch(item) {
      case 1:
        fields = [
          {
            name: "You bought a Nanotube fishing line",
            value: `Good luck breaking that one`,
          },];
          break;
      case 2:
        fields = [
          {
            name: "You bought a Lucky bait",
            value: `Luck of the sea`,
          },];
          break;
      case 3:
        fields = [
          {
            name: "You bought a Reinforced boat",
            value: `Surely the sharks cant get you now`,
          },];
        break;

    }
}else{
  fields = [
    {
      name: "The transaction failed",
      value: `You either dont have enough money or specified the wrong item.`,
    },
  ];
}
  fields.forEach((field, i) => {
    fields[i].inline = true;
  });
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

const buying = async (msg, args) => {
  const authorId = msg.author.id;
  const [user] = await fishermanModel
    .findOrCreate({
      where: { discordId: authorId },
    })
    .catch((err) => {
      console.error(err);
    });
  var item;
  if(Number.isInteger(parseInt(args)) && args.length==1){
    item=parseInt(args);
  }
  var transaction=false;
  if(Number.isInteger(item) && item>0 && item<4){
    console.log(transaction);
    transaction=user.addItem(item);
    console.log(transaction);
  }

  await user.save().catch((err) => {
    console.error(err);
    return;
  });


  return embed(msg, args, user, item, transaction);
};

module.exports = {
  name: "!buy",
  description:
    "Buying items",
  execute(msg, args, options = {}) {
    buying(msg, args);
  },
};
