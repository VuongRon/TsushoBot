const embedMessage = (msg, message) => {
  return embed(msg, {
    description: message,
  });
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

const embed = (msg, options = {}) => {
  const embed = Object.assign(embedTemplate(msg), options);
  return msg.channel.send({ embed });
};

module.exports = {
  embedMessage,
  embed,
};
