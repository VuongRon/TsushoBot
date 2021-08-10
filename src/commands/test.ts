import { Interaction, MessageEmbedOptions } from "discord.js";
import { CommandTemplate } from "../types/command.type";
import { EmbedBuilder } from "../services/EmbedBuilder";

/*
 |--------------------------------------------------------------------------
 | Command Logic
 |--------------------------------------------------------------------------
 |
 | To avoid command file pollution, the logic should be called in the 
 | external command file, which returns a response that allows building
 | an Embed. Refer to the EmbedBuilder explanation below.
 |
 | Constants are still fine to define here, like embed Colors or a constant title
 |
 */

// ---

/** Call your Command here */

// ---

const commandTemplate: CommandTemplate = {
  name: "testcommand",
  description: "A test command.",

  embed: function (interaction: Interaction): MessageEmbedOptions {
    /**
     * By default, the EmbedBuilder returns an Embed with the author only - an empty embed,
     * that has to be constructed by this command.
     *
     * The builder is chainable, so we can construct a full embed calling different methods,
     * like in the following example:
     *
     * We want to create an embed that displays a basic title, __a different author__, and some description
     *
     * Note, that Author (initiator) is printed by default, this field is of course mutable.
     * This field can be replaced with a new Author if, for example, we want to address another user - we
     * have a small versus game, and the loser is printed out
     *
     * return new EmbedBuilder(interaction)
     *    .author(newAuthor)
     *    .title(newTitle)
     *    .description(battleLog)
     *    .color(green)
     *    .get();
     */
    return new EmbedBuilder(interaction).get();
  },
};

export { commandTemplate };
