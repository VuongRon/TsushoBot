import { Interaction, MessageEmbedAuthor, MessageEmbedOptions } from "discord.js";
import { CommandResponse } from "../types/discord-types.type";

/** Creates a new Embed response depending on the Type of the event we are handling */
export class EmbedBuilder {
  /** Embed object constructed by the Command during the call. Contains the  */
  private embedObject: MessageEmbedOptions = {};

  /**
   * @param interaction   Interaction response object
   */
  constructor(private interaction: Interaction) {
    // Each embed __has to__ have the Author injected by default,
    // at least in our implementation - not required, though
    this.author();
  }

  /**
   * Inject the Interaction/Message author into the embed.
   *
   * If the Author parameter was omitted, will insert the initiator as the author,
   * which is the user executing the SlashCommand (Interaction)
   */
  public author(author?: MessageEmbedAuthor): this {
    this.embedObject.author = author ?? {
      name: this.interaction.user.username,
      iconURL: this.interaction.user.displayAvatarURL(),
    };
    return this;
  }

  /**
   * Returns the result of the embed build
   */
  public get(): MessageEmbedOptions {
    return this.embedObject;
  }
}
