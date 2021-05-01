const embedService = require("../services/embedService");

const getHelp = (msg, args, commands) => {
  const fields = [];

  commands.forEach((command) => {
    if (command.name && command.description)
      fields.push({
        name: `!${command.name}`,
        value: command.description,
      });
  });
  return embedService.embed(msg, args, {
    fields,
  });
};

const execute = (msg, args, options) => {
  if (options.commands) {
    getHelp(msg, args, options.commands);
  }
}

const commandTemplate = {
  name: "help",
  description: "The command to show all other commands.",
  execute: execute
}

export {
  commandTemplate
}