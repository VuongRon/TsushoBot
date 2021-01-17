const argsTitle = (args) => {
  const argsArray = args.join(" ");
  const maxLength = 100;
  return argsArray.length > maxLength
    ? argsArray.substring(0, maxLength - 3) + "..."
    : argsArray;
};

const embedTemplate = (msg) => {
  return {
    color: 16750462,
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

const embed = (msg, args, options: any = {}) => {
  let embed = Object.assign(embedTemplate(msg), options);
  if (options.argsTitle)
    embed = Object.assign(embed, { title: argsTitle(args) });
  return msg.channel.send({ embed });
};

export {
  embedMessage,
  embed
}