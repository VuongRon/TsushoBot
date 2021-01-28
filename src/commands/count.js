const embedService = require("../services/embedService");
import { UserModule } from "../models";


const randomCount = () => {
  const num = Math.floor(Math.random() * 10) + 1;
  if (num > 2) {
    return 1;
  } else {
    return 5;
  }
};

const embed = (msg, args, count, userCount) => {
  const critical = count === 5;
  const criticalMessage = critical ? "**Critical Count!** " : "";
  const message = `${criticalMessage}You counted by ${count}.\n\n Your total is now **${userCount}**.`;
  return embedService.embedMessage(msg, args, message);
};

const count = async (msg, args) => {
  const authorId = msg.author.id;
  const [user] = await UserModule.User
    .findOrCreate({
      where: { discordId: authorId },
    })
    .catch((err) => {
      console.error(err);
    });
  const count = randomCount();
  user.count += count;
  await user.save().catch((err) => {
    console.error(err);
    return;
  });
  return embed(msg, args, count, user.count);
};

module.exports = {
  name: "!count",
  description:
    "Incrementally increases your saved counter, with a chance to hit a critical increment.",
  execute(msg, args, options = {}) {
    count(msg, args);
  },
};
