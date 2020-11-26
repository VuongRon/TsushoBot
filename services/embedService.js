const argsTitle = (args) => {
  const argsArray = args.join(" ");
  const maxLength = 100;
  return argsArray.length > maxLength
    ? argsArray.substring(0, maxLength - 3) + "..."
    : argsArray;
};

const embedTemplate = (msg, color = 16750462) => {
  return {
    color,
    author: {
      name: `${msg.author.username}`,
      icon_url: `${msg.author.avatarURL()}`,
    },
  };
};

const embedMessage = (msg, args, message) => {
  return embed(msg, args, {
    description: message,
  });
};

const embed = (msg, args, options = {}) => {
  let embed;
  options.color
    ? (embed = Object.assign(embedTemplate(msg, options.color), options))
    : (embed = Object.assign(embedTemplate(msg), options));
  if (options.argsTitle)
    embed = Object.assign(embed, { title: argsTitle(args) });
  return msg.channel.send({ embed });
};

module.exports = {
  embedMessage,
  embed,
};
