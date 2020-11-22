const embedService = require("../services/embedService");
const fishService = require("../services/fishService");
const db = require("../models").sequelize;

const fishermanModel = db.models.Fisherman;

const embed = (msg, args, user, item, transaction) => {
  const author = {
    name: `${msg.author.username} is purchasing an item`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = false;
  let fields;
  if(transaction==undefined){
    fields = [
      {
        name: "The transaction failed",
        value: `You either dont have enough money or specified the wrong item.`,
      },
    ];
  }else if(transaction){
        fields = [
          {
            name: `You bought a ${item.name}`,
            value: `${item.flvr1}`,
          },
        ];
    }else{
        fields = [
          {
            name: `You already own a ${item.name}`,
            value: `${item.flvr2}`,
          },];
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
  let id;
  if(Number.isInteger(parseInt(args)) && args.length==1){
    id=parseInt(args);
  }
  let transaction=undefined;
  if(Number.isInteger(id) && id>0 && id<4){
    transaction=user.addItem(id);
  }
  let item1 = new fishService.Item(id);
  await user.save().catch((err) => {
    console.error(err);
    return;
  });


  return embed(msg, args, user, item1, transaction);
};

module.exports = {
  name: "!buy",
  description:
    "Buying items",
  execute(msg, args, options = {}) {
    buying(msg, args);
  },
};
