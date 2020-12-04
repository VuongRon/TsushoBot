const embedService = require("../services/embedService");
const db = require("../models").sequelize;
const userModel = db.models.User;
const axios = require("axios").default;

const setWhitelist = async (msg, args) => {
  if (
    msg.channel.type === "text" &&
    msg.member.roles.cache.some((role) => role.name === "Moderator")
  ) {
    if (msg.mentions.users.size) {
      const mentionedUser = msg.mentions.users.first();
      const user = await userModel.findOrCreateByDiscordId(mentionedUser.id);
      user.whitelisted ? (user.whitelisted = false) : (user.whitelisted = true);
      await user.save().catch((err) => {
        console.error(err);
        return;
      });
      let message;
      user.whitelisted
        ? (message = `${mentionedUser.tag} is now whitelisted.`)
        : (message = `${mentionedUser.tag} is no longer whitelisted.`);
      return embedService.embedMessage(msg, args, message);
    } else if (!Array.isArray(args) || !args.length) {
      const whitelistedUsers = await userModel
        .findAll({
          where: {
            whitelisted: true,
          },
        })
        .catch((err) => {
          console.error(err);
        });

      const config = {
        headers: {
          Authorization: `Bot ${process.env.TOKEN}`,
        },
      };

      let userUsernames = [];

      for (const user of whitelistedUsers) {
        await axios
          .get(`https://discord.com/api/users/${user.discordId}`, config)
          .then((response) => {
            userUsernames.push({
              username: response.data.username,
              discriminator: response.data.discriminator,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }

      let message = "Whitelisted users:\n";

      userUsernames.forEach((user) => {
        message += `${user.username}#${user.discriminator}\n`;
      });

      const embed = {
        color: 16750462,
        author: {
          name: `${msg.author.username}`,
          icon_url: `${msg.author.avatarURL()}`,
        },
        description: message,
      };

      return msg.author.send({ embed });
    }
  }
};

module.exports = {
  name: "!whitelist",
  description:
    "Adds or removes the `whitelisted` flag from a user. Only executable in a server's text channel.",
  guildOnly: true,
  execute(msg, args, options = {}) {
    setWhitelist(msg, args);
  },
};
