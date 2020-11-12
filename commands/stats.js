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
  return Math.floor(
    parseInt(getRandomValue(6, 6 / 3, numbers.random.distribution.normal), 10)
  );
};

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
        "name": ":vs: MMR",
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
        "name": ":straight_ruler: Length",
        "value": `${getLength()} in`,
        "inline": true
      }
    ]
  };
  return msg.channel.send({ embed: stats });
}

module.exports = {
  name: "!stats",
  description: "Your stats.",
  execute(msg, args) {
    embedMessage(msg, args);
  },
};
