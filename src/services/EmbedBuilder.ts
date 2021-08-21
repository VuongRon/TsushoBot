import {
  ColorResolvable,
  EmbedField,
  EmbedFieldData,
  Interaction,
  MessageEmbed,
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedImage,
  MessageEmbedThumbnail,
  User,
} from "discord.js";
import { EmbedDoubleColumn, EmbedTripleColumn } from "../types/discord-types.type";
import {
  InvalidCommandInteractionException,
  InvalidEmbedAuthorException,
  InvalidEmbedDateException,
  InvalidEmbedDescriptionException,
  InvalidEmbedFieldsException,
  InvalidURLException,
} from "../types/exception.type";

/**
 * Allows inserting specific sections of the Embed to create a combined response.
 * The purpose of this builder is to extend on the built-in MessageEmbed,
 * to add some validators/fallbacks/type guards and __to expand further, if needed__ *
 *
 * * - some methods were left as simple DiscordSetters as placeholders in case additional
 * operations are needed - conversions/more fallbacks
 *
 * Requires calling .get() method to get the built object.
 *
 * Note: embed fails when there is no description()
 */
export class EmbedBuilder {
  /**
   * Embed object constructed by the Command during the call. Will contain the
   * results of chained calls invoked by the Command file
   */
  private embed: MessageEmbed = new MessageEmbed();

  /**
   * @param interaction   Interaction response object
   * @param isMainEmbed   When true, automatically inserts the interaction initiator. Allows setting the author during construction
   * @param author        Override to display a different user in this embed
   */
  constructor(private interaction: Interaction, isMainEmbed: boolean = false, author?: User | MessageEmbedAuthor) {
    // Ideally, the first embed on the list should have the Author inserted,
    // but we still want to give user the choice to insert Author into the embed.
    // This resolves the problem with inserting the author into each embed when
    // we are using multiple embeds. We don't need the author to be present in
    // every section...
    if (isMainEmbed) {
      // Type guard - force conversion
      if (author instanceof User) {
        author = <MessageEmbedAuthor>{ name: author.username, iconURL: author.displayAvatarURL() };
      }

      this.setAuthor(author);
    }

    // This implementation uses a default, custom color for every embed
    // TODO: change this when Constants Provider is implemented
    this.embed.setColor(16750462);
  }

  /**
   * Sets a new Description in this embed.
   *
   * NOTE: This field is __required__
   *
   * @param   {string}  description  Embed description, inserted below the embed title
   */
  public setDescription(description: string): this {
    this.embed.setDescription(description);

    return this;
  }

  /**
   * Insert the Interaction/Message author into the embed.
   *
   * If the Author parameter was omitted, will insert the interaction
   * initiator as the author - user executing the SlashCommand (Interaction).
   * Sometimes we would want a different user to be present in the output,
   * this allows addressing someone else in the result of the command execution.
   *
   * @param   {MessageEmbedAuthor}  author  User executing the command
   *
   * @throws  {InvalidEmbedAuthorException}
   */
  public setAuthor(author?: MessageEmbedAuthor): this {
    const embedAuthor: MessageEmbedAuthor = author ?? {
      name: this.interaction.user.username,
      iconURL: this.interaction.user.displayAvatarURL(),
    };

    // Safe check against missing name when MessageEmbedAuthor is provided
    // This should never happen, though.
    if (!embedAuthor.name) throw new InvalidEmbedAuthorException();

    this.embed.setAuthor(embedAuthor.name, embedAuthor.iconURL);

    return this;
  }

  /**
   * Inserts a string that fills the Title section of built Embed Object. Supports Markdown
   *
   * @param   {string}  title  Embed title displayed at the top of the embed (below Author section)
   */
  public setTitle(title: string): this {
    // Do something with the title in the future
    // Example: filter for NSFW content or some formatting
    this.embed.setTitle(title);

    return this;
  }

  /**
   * When specified, the EmbedTitle will create a hyperlink. If the title
   * was not present, inserting this will do nothing
   *
   * @param   {string}  url   URL to external website.
   */
  public setUrl(url: string): this {
    // TODO: possibly, add a spam link filter / NSFW filter in the future (if needed)
    this.validateURL(url);
    this.embed.setURL(url);

    return this;
  }

  /**
   * Changes this embed's Accent. Supports: "COLOR_NAME", "RANDOM", [R:number, G:number, B:number],
   * Decimal (number) and Hexadecimal representation (`#${string}`)
   *
   * @param   {ColorResolvable}  color  Refer to the ColorResolvable type definition for more available values
   */
  public setColor(color: ColorResolvable): this {
    // Do something with the passed color in the future, if needed
    this.embed.setColor(color);

    return this;
  }

  /**
   * Inserts a Date time into this embed.
   *
   * NOTE: If Footer section was inserted, the date will be rendered to the right of the Footer Text
   *
   * @param   {Date}  timestamp
   *
   * @throws  {InvalidEmbedDateException}
   */
  public setTimestamp(timestamp: Date): this {
    if (isNaN(timestamp.getTime())) throw new InvalidEmbedDateException(timestamp);

    this.embed.setTimestamp(timestamp);

    return this;
  }

  /**
   * Inserts a Footer section into this embed. If timestamp() was called, it will
   * will also be inserted into this footer
   *
   * @param   {MessageEmbedFooter}  footer    Footer section object, or a regular string-type footer
   * @param   {string}              iconUrl   Optional link to an icon rendered in front of the footer text
   */
  public setFooter(footer: MessageEmbedFooter | string, iconUrl?: string): this {
    // Type guard against text-based footer
    if (typeof footer === "string") {
      this.embed.setFooter(footer, iconUrl);

      return this;
    }

    // Insert a MessageEmbedFooter-type footer if the builder was called with a regular
    // string footer.
    this.embed.footer = footer;

    return this;
  }

  /**
   * Inserts an additional column on the right side of the embed, which renders the
   * image from the specified URL. The thumbnail is located at the top of this column.
   *
   * More details may be specified when EmbedThumbnail object is provided, which allows
   *
   *
   * @param   {MessageEmbedThumbnail | string}  thumbnail  Thumbnail image URL or MessageEmbedThumbnail object
   */
  public setThumbnail(thumbnail: MessageEmbedThumbnail | string): this {
    // Type guard against regular string-based thumbnails
    if (typeof thumbnail === "string") {
      this.validateURL(thumbnail);
      this.embed.setThumbnail(thumbnail);

      return this;
    }

    // With an EmbedThumbnail object, the URL inside should also be validated
    this.validateURL(thumbnail.url);

    // Insert a detailed thumbnail if EmbedThumbnail object was provided
    // This allows specifying thumbnail dimensions and proxy URL.
    // Apparently, image size is not supported yet(?)
    this.embed.thumbnail = thumbnail;

    return this;
  }

  public setImage(image: MessageEmbedImage | string): this {
    // TODO: possibly, add a spam link filter / NSFW filter

    // Type guard against regular string-based thumbnails
    if (typeof image === "string") {
      this.validateURL(image);
      this.embed.setImage(image);

      return this;
    }

    // Validate the image URL inside the EmbedImage object
    this.validateURL(image.url);

    // Insert a detailed image if MessageEmbedImage object was provided
    // This allows specifying image dimensions and proxy URL.
    // Apparently, image size is not supported yet(?)
    this.embed.image = image;

    return this;
  }

  /**
   * Adds a new Field to this embed. Accepts both string/string and an object of EmbedFieldData
   *
   * NOTE: both field Name and field Value are required when using a simple insertion (string/string)
   *
   * @param   {EmbedFieldData|string}   field   FieldData object or field Title (name) (when string gets passed in)
   * @param   {string}                  value   Field value used when simple insertion (name:value) is performed. Required only if the field is a string
   * @param   {boolean}                 inline  Sets this field in-line with other fields. Requires other sibling to be in-line to take effect
   *
   * @throws  {InvalidEmbedFieldsException}
   */
  public addField(field: EmbedFieldData | string, value?: string, inline?: boolean): this {
    // Type guard against regular field insertion
    if (typeof field === "string") {
      // Both name and value have to be present
      if (!field || !value) {
        throw new InvalidEmbedFieldsException([field, value]);
      }

      this.embed.addField(field, value, inline);
      return this;
    }

    // If the object was passed instead, we still have to check for the required fields...
    // Maybe the command execution resulted in passing an empty string somehow
    for (const property in field) {
      if (!field[property as keyof EmbedFieldData]) {
        throw new InvalidEmbedFieldsException(property);
      }
    }

    // The reason for casting to EmbedField is that we don't want to require the inline field to be present,
    // but due to type mismatch on fields property we have to cast it to the required type
    this.embed.fields.push(<EmbedField>field);

    return this;
  }

  /**
   * Inserts in-line fields into the EmbedFields.
   *
   * It is important for the __previous__ field to not have in-line option
   * to achieve the desired effect. Accepts Two and Three elements.
   *
   * NOTE: To display TWO elements in one row, the surrounding elements (top and bottom)
   * can __not__ have in-line property set as true. The row elements could also be long
   * enough to break the line, but ideally it would be more safe to force a "new line"
   * with a new element without in-line property
   *
   * @param   {EmbedFieldData}  fields  Tuple of EmbedFields creating a row of two in-line segments
   */
  public addRow(fields: EmbedDoubleColumn | EmbedTripleColumn): this {
    // Because we allow a shortcut without declaring in-line property,
    // we have to force in-line style on each field
    fields.forEach((el) => (el.inline = true));

    // and we have to cast it to appropriate type, required by Discord
    this.embed.fields.push(...(<EmbedField[]>fields));

    return this;
  }

  /**
   * Returns the result of the embed build
   *
   * NOTE: Description is __required__ for the Embed to be accepted by Discord
   *
   * @throws  {InvalidEmbedDescriptionException}
   */
  public get(): MessageEmbed {
    if (!this.embed.description) {
      throw new InvalidEmbedDescriptionException();
    }

    return this.embed;
  }

  /**
   * Extracts the Command Name from
   *
   * @return  {string}  [return description]
   */
  private getCommandName(): string {
    // This check is required to let TypeScript know the type of this interaction is CommandInteraction
    if (!this.interaction.isCommand()) {
      throw new InvalidCommandInteractionException();
    }

    return this.interaction.commandName;
  }

  /**
   * Checks if the provided string is a valid URL and returns it after the a successful validation
   *
   * @param   {string}  url  URL string
   *
   * @throws  {InvalidURLException}
   */
  private validateURL(url: string): string | never {
    // The invalid URL should get caught before returning
    try {
      return new URL(url).href;
    } catch (error) {
      throw new InvalidURLException(url);
    }
  }
}
