import { Message, MessageOptions } from "discord.js";

const argsTitle = (args: string[]): string | undefined => {
  if (args) {
    const argsArray = args.join(" ");
    const maxLength = 100;
    return argsArray.length > maxLength
      ? argsArray.substring(0, maxLength - 3) + "..."
      : argsArray;
  }
};

const embedMessage = (msg: Message, args: string[], message: string) => {
  return embed(msg, args, {
    description: message,
  });
};

const embed = (msg: Message, args: string[], options: any = {}) => {
  let message: MessageOptions = {
    embeds: [
      {
        author: {
          name: msg.author.username,
          iconURL: msg.author.displayAvatarURL(),
        },
        color: 16750462,
        title: argsTitle(args),
        /* TODO */
        description: options?.description,
      },
    ],
  };
  return msg.channel.send(message);
};

export { embedMessage, embed };