const numbers = require("numbers");

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

const checkArgsLength = (args) => {
  args = args.join(" ");
  let maxLength = 100;
  return args.length > maxLength ? args.substring(0, maxLength - 3) + '...' : args;
}

const getIQ = () => {
  return Math.floor(
    parseInt(
      getRandomValue(100, 100 / 3, numbers.random.distribution.normal),
      10
    )
  );
};

const getLooks = () => {
  return Math.floor(
    parseInt(getRandomValue(5, 5 / 3, numbers.random.distribution.normal), 10)
  );
};

const getMMR = () => {
  return Math.floor(
    parseInt(
      getRandomValue(5000, 5000 / 3, numbers.random.distribution.normal),
      10
    )
  );
};

const getSalary = () => {
  return Math.floor(
    parseInt(
      getRandomValue(1, 1, numbers.random.distribution.logNormal) * 50000,
      10
    )
  );
};

const getLength = () => {
  const randomInches = Math.floor(parseInt(getRandomValue(6, 6 / 3, numbers.random.distribution.normal), 10));
  return `${randomInches} in (${Math.floor(randomInches * 2.54)} cm)`;
};

const getHeight = () => {
  const randomInches = Math.floor(parseInt(getRandomValue(67, 67 / 5, numbers.random.distribution.normal), 10));
  return `${Math.floor(randomInches / 12)}'${Math.floor(randomInches % 12)}" (${Math.floor(randomInches * 2.54)} cm)`;
}

const getWeight = () => {
  const randomPounds = Math.floor(parseInt(getRandomValue(175, 175 / 3, numbers.random.distribution.normal), 10));
  return `${randomPounds} lb (${Math.floor(randomPounds / 2.205)} kg)`;
}

const embedMessage = (msg, args) => {
  const stats = {
    "title": `${args ? checkArgsLength(args) : ''}`,
    "color": 16750462,
    "author": {
      "name": `${msg.author.username}`,
      "icon_url": `${msg.author.avatarURL()}`
    },
    "fields": [
      {
        "name": ":eyes: Looks",
        "value": `${getLooks()}/10`,
        "inline": true
      },
      {
        "name": ":brain: IQ",
        "value": `${getIQ()}`,
        "inline": true
      },
      {
        "name": ":video_game: MMR",
        "value": `${getMMR()}`,
        "inline": true
      },
      {
        "name": ":moneybag: Salary",
        "value": `$${getSalary()
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        "inline": true
      },
      {
        "name": ":pinching_hand: Length",
        "value": `${getLength()}`,
        "inline": true
      },
      {
        "name": ":straight_ruler: Height",
        "value": `${getHeight()}`,
        "inline": true
      },
      {
        "name": ":scales: Weight",
        "value": `${getWeight()}`,
        "inline": true
      },
    ]
  };
  return msg.channel.send({ embed: stats });
}

module.exports = {
  name: "!stats",
  description: "Shows your randomized stats. Each stat is normally distributed.",
  execute(msg, args) {
    embedMessage(msg, args);
  },
};
