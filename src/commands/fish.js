const embedService = require("../services/embedService");
const rngService = require("../services/rngService");
const fishService = require("../services/fishService");
const talkedRecently = new Set();

import { FishermanModule } from "../models";

const generateRoll = (std) => {
  return rngService.normalDistribution(50, std);
};

function getFish(fisherman) {
  var roll = generateRoll(25);
  if (fisherman.bait) {
    roll = generateRoll(30);
  }
  if (fisherman.line) {
    roll = roll > 50 ? roll + 5 : roll - 5;
  }
  if (roll == 113) {
    return false;
  }
  return new fishService.Fish(roll);
}

const embed = (msg, args, fish, fishAmount) => {
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
      valuem = `*${fish.cmt}*\n\u200b\nYou now have **${fishAmount}** :${fish.value}:`;
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
  const fisherman = await FishermanModule.findOrCreateByDiscordId(msg.author.id);
  let fish = getFish(fisherman);
  let fishAmount;
  if (!fish) {
    fisherman.removeAllFish();
  } else if (fish.value !== undefined) {
    fisherman[fish.value]++;
    fishAmount = fisherman[fish.value];
  }
  await fisherman.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, fish, fishAmount);
};

const execute = (msg, args) => {
  if (!talkedRecently.has(msg.author.id)) {
    fishing(msg, args);
    talkedRecently.add(msg.author.id);
    setTimeout(() => {
      talkedRecently.delete(msg.author.id);
    }, 3500);
  }
}

const commandTemplate = {
  name: "fish",
  description: "Fishing yeah",
  execute: execute
}

export {
  commandTemplate
}