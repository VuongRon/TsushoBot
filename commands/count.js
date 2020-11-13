const fs = require("fs");
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
  return {
    color: 16750462,
    author: {
      name: `${msg.author.username}`,
      icon_url: `${msg.author.avatarURL()}`,
    },
    description: `${
      critical ? "**Critical Count!** " : ""
    }You counted by ${count}.\n\n Your total is now **${userCount}**.`,
  };
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
  return msg.channel.send({ embed: embed(msg, count, user.count) });
};
module.exports = {
  name: "!count",
  description: "Counting",
  execute(msg, args) {
    count(msg);
  },
};
