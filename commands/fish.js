const embedService = require("../services/embedService");
const rngService = require("../services/rngService");
const fishService = require("../services/fishService");
const talkedRecently = new Set();
const db = require("../models").sequelize;

const fishermanModel = db.models.Fisherman;

const generateRoll = (std) => {
  return rngService.normalDistribution(50, std);
};

function getFish(user) {
  var roll = generateRoll(25);
  if (user.bait) {
    roll = generateRoll(30);
  }
  if (user.line) {
    roll = roll > 50 ? roll + 5 : roll - 5;
  }
  if (roll == 113) {
    return false;
  }
  return new fishService.Fish(roll);
}

const embed = (msg, args, fish, userFish) => {
  const author = {
    name: `${msg.author.username} is fishing...`,
    icon_url: `${msg.author.avatarURL()}`,
  };
  const argsTitle = true;
  var valuem;
  var fields;
  if (!fish) {
    fields = [
      {
        name: `:shark: Uh Oh :shark:`,

        value: `A shark attacked your boat, you lost all your fish`,
        inline: true,
      },
    ];
  } else {
    if (fish.value !== undefined) {
      valuem = `*${fish.cmt}*\n\u200b\nYou now have **${userFish}** :${fish.value}:`;
    } else {
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
  const [user] = await fishermanModel
    .findOrCreate({
      where: { discordId: authorId },
    })
    .catch((err) => {
      console.error(err);
    });
  var fish = getFish(user);
  var userFish;
  if (!fish) {
    user.removeAllFish();
  } else if (fish.value !== undefined) {
    eval("user." + fish.value + "++");
    userFish = eval("user." + fish.value);
  }
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, fish, userFish);
};

module.exports = {
  name: "!fish",
  description: "Fishing yeah",
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
