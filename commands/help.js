const embedService = require("../services/embedService");

const getHelp = (msg, commands) => {
  const fields = [];

  commands.forEach((command) => {
    if (command.name && command.description)
      fields.push({
        name: command.name,
        value: command.description,
      });
  });
  return embedService.embed(msg, args, {
    fields,
  });
};

module.exports = {
  name: "!help",
  description: "The command to show all other commands.",
  execute(msg, args, options = {}) {
    if (options.commands) getHelp(msg, options.commands);
  },
};
