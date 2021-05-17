require("dotenv").config();
const embedService = require("../services/embedService");
import { MediaModule } from "../models";

const approverRole = process.env.hasOwnProperty("APPROVER_ROLE")
  ? process.env.APPROVER_ROLE
  : "Moderator";

const emojisConfig = require("../config/constants/reactions.json");
const config = require("./config/approve.json");

const getApproval = async (msg, args, resource) => {
  const reactionEmojis = emojisConfig.reactionFilterEmojis;
  const reactionEmojisFilter = Object.values(reactionEmojis);
  const reactionFilter = (reaction, user) => {
    return (
      reactionEmojisFilter.includes(reaction.emoji.name) &&
      user.id === msg.author.id
    );
  };
  msg.channel
    .send(resource.mediaContent)
    .then((message) => {
      message
        .react(reactionEmojis.approve)
        .then(() => message.react(reactionEmojis.reject));
      message
        .awaitReactions(reactionFilter, {
          max: 1,
          time: 60000,
          errors: ["time"],
        })
        .then(async (collected) => {
          const reaction = collected.first();
          if (reaction.emoji.name === reactionEmojis.approve) {
            resource.approved = true;
            await resource.save().catch((err) => {
              console.error(err);
              return;
            });
            const embedMessage = `Resource ${resource.mediaContent} (ID ${resource.id}) has been approved.`;
            return embedService.embedMessage(msg, args, embedMessage);
          } else {
            await resource.destroy().catch((err) => {
              console.error(err);
              return;
            });
            const embedMessage = `Resource ${resource.mediaContent} (ID ${resource.id}) has been removed from the database.`;
            return embedService.embedMessage(msg, args, embedMessage);
          }
        })
        .then(() => {
          message.delete();
          approve(msg, args);
        })
        .catch(() => {
          message.delete();
          const embedMessage = "The approval reaction listener has timed out!";
          return embedService.embedMessage(msg, args, embedMessage);
        });
    })
    .catch(async (err) => {
      console.error(err);
      await resource.destroy().catch((error) => console.error(error));
      const embedMessage = `Resource ID ${resource.id} has been removed from the database due to being invalid.`;
      return embedService.embedMessage(msg, args, embedMessage);
    });
};

const removeApproval = async (msg, args, resource) => {
  if (resource.approved) {
    resource.approved = false;
    await resource.save().catch((err) => {
      console.error(err);
      return;
    });
    const message = `Successfully removed \`approved\` from ${resource.mediaContent} (ID ${resource.id}).`;
    return embedService.embedMessage(msg, args, message);
  } else {
    const message = `${resource.mediaContent} (ID ${resource.id}) is not \`approved\`.`;
    return embedService.embedMessage(msg, args, message);
  }
};

const approve = async (msg, args) => {
  if (
    msg.channel.type === "text" &&
    msg.member.roles.cache.some((role) => role.name === approverRole) &&
    args
  ) {
    const commandNames = config.commandNames;
    if (commandNames.includes(args[0])) {
      const passedCommand = args[0];
      const resource = await MediaModule
        .findFirstUnapprovedByCommandName(passedCommand)
        .catch((err) => {
          console.error(err);
          return;
        });
      if (resource) {
        await getApproval(msg, args, resource);
      } else {
        const message =
          "There are no more enqueued resources for this command type.";
        return embedService.embedMessage(msg, args, message);
      }
    } else if (args[0] === "remove" && args[1]) {
      const passedId = args[1];
      const resource = await MediaModule.findOneById(passedId).catch((err) => {
        console.error(err);
        return;
      });
      if (resource) {
        await removeApproval(msg, args, resource);
      }
    }
  }
};

const execute = (msg, args) => {
    approve(msg, args);
}

const commandTemplate = {
  name: "approve",
  description: "Approve enqueued media resources.",
  execute: execute
}

export {
  commandTemplate
}