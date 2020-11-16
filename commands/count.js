const fs = require("fs");
const embedService = require("../services/embedService");
const userFileLocation = "users";

const randomCount = () => {
  const num = Math.floor(Math.random() * 10) + 1;
  if (num > 2) {
    return 1;
  } else {
    return 5;
  }
};

const embed = (msg, count, userCount) => {
  const critical = count === 5;
  const criticalMessage = critical ? "**Critical Count!** " : "";
  const message = `${criticalMessage}You counted by ${count}.\n\n Your total is now **${userCount}**.`;
  return embedService.embedMessage(msg, args, message);
};

const count = (msg) => {
  const authorId = msg.author.id;
  const filePath = `${userFileLocation}/${authorId}.json`;
  const count = randomCount();
  let user = {
    count: count,
  };
  if (fs.existsSync(filePath)) {
    const rawdata = fs.readFileSync(filePath);
    user = JSON.parse(rawdata);
    if (user.count) {
      user.count += count;
    } else {
      user.count = count;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(user));
  return embed(msg, count, user.count);
};
module.exports = {
  name: "!count",
  description:
    "Incrementally increases your saved counter, with a chance to hit a critical increment.",
  execute(msg, args, options = {}) {
    count(msg);
  },
};
