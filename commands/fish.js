const embedService = require("../services/embedService");
const rngService = require("../services/rngService");
const talkedRecently = new Set();
const db = require("../models").sequelize;
const userModel = db.models.User;
const fishermanModel = db.models.Fisherman;

const generateRoll = (std) => {
  return rngService.normalDistribution(50, std);
};

function getFish(user) {
  var roll = generateRoll(25);
  if(user.bait){
    roll = generateRoll(30);
  }
  if(user.line){
    roll = (roll>50? roll+5:roll-5);
  }
  if(roll==113){
    return false;
  }
  return new Fish(roll);
}

const embed = (msg, args, fish, userFish) => {

  const author = {
    name: `${msg.author.username} is fishing...`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = true;
  var valuem;
  var fields;
  if(!fish){
    fields = [{
      name: `:shark: Uh Oh :shark:`,

      value: `A shark attacked your boat, you lost all your fish`,
      inline: true,
      },
    ];
  }else{
    if(fish.value!==undefined){
      valuem = `*${fish.cmt}*\n\u200b\nYou now have **${userFish}** :${fish.value}:`;
    }else{
      valuem = `*${fish.cmt}*`;
    }
    fields = [
      {
        name: `${fish.msg}`,

        value: `${valuem}`,
        inline: true,
      },
    ];
  }
  return embedService.embed(msg, args, {
    author,
    argsTitle,
    fields,
  });
};

const fishing = async (msg, args) => {
  const authorId = msg.author.id;
  console.log(db.models);
  const [user] = await fishermanModel
    .findOrCreate({
      where: { discordId: authorId },
    })
    .catch((err) => {
      console.error(err);
    });
  var fish = getFish(user);
  var userFish;
  if(!fish){
    user.removeAllFish();
  }else if(fish.value!==undefined){
    eval("user."+fish.value+"++");
    userFish=eval("user."+fish.value);
  }
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, fish, userFish);
};

module.exports = {
  name: "!fish",
  description:
    "Fishing yeah",
  execute(msg, args, options = {}) {
    if (!talkedRecently.has(msg.author.id)) {
      fishing(msg, args);
      talkedRecently.add(msg.author.id);
      setTimeout(() => {
        talkedRecently.delete(msg.author.id);
      }, 3500);
    }
  },
};

class Fish{
msg;
cmt;
value;
price;
  constructor(roll) {
    if (roll < -5) {
      this.msg="You caught a :motorized_wheelchair:!";
      this.cmt="2fast2furious";
      this.value="motorized_wheelchair";
      this.price=100;
    } else if (roll < 0) {
      this.msg="You caught a :manual_wheelchair:!";
      this.cmt=":fire:";
      this.value="manual_wheelchair";
      this.price=50;
    } else if (roll < 10) {
      this.msg="You caught my :heart:!";
      this.cmt=":flushed:";
      this.value="heart";
      this.price=25;
    } else if (roll < 25) {
      this.msg="You caught nothing!";
      this.cmt="Unlucky";
    } else if (roll >= 100) {
      this.msg="You caught a :blowfish:!";
      this.cmt="INSANE!";
      this.value="blowfish";
      this.price=50;
    } else if (roll >= 90) {
      this.msg="You caught a :tropical_fish:!";
      this.cmt="Pog!";
      this.value="tropical_fish";
      this.price=25;
    } else if (roll >= 75) {
      this.msg="You caught a :fish:!";
      this.cmt="nice";
      this.value="fish";
      this.price=10;
    } else if (roll >= 50) {
      this.msg="You caught a :boot:!";
      this.cmt="It's brand new";
      this.value="boot";
      this.price=1;
    } else if (roll >= 25) {
      this.msg="You caught a :wrench:!";
      this.cmt="Maybe someone else can use it";
      this.value="wrench";
      this.price=1;
    }
  }
}
