import {
  Client,
  ColorResolvable,
  CommandInteraction,
  EmbedField,
  Intents,
  MessageEmbedFooter,
  MessageEmbedImage,
  MessageEmbedThumbnail,
  SnowflakeUtil,
  User,
} from "discord.js";
import { EmbedBuilder } from "../src/services/EmbedBuilder";
import { EmbedDoubleColumn, EmbedTripleColumn } from "../src/types/discord-types.type";
import {
  InvalidCommandInteractionException,
  InvalidEmbedAuthorException,
  InvalidEmbedDateException,
  InvalidEmbedDescriptionException,
  InvalidEmbedFieldsException,
  InvalidURLException,
} from "../src/types/exception.type";
import { MockInteraction } from "./Mocks/CommandInteraction.mock";
import { FakeUser } from "./Mocks/Types.mock";
import { MockAPIUser, MockUser } from "./Mocks/User.mock";

let client: Client;
let embed: EmbedBuilder;
let interaction: CommandInteraction;
/* single test use */
let _interaction: CommandInteraction;

// We need a custom users for these tests
const fakeUser1: FakeUser = new MockUser({
  id: SnowflakeUtil.generate(),
  username: "TestUserONE",
  avatar: "",
  discriminator: MockUser.makeDiscriminator(),
});

// This user will be used as MessageEmbedAuthor, thus testing internal cast
// Not necessary
let fakeUser2: User;

beforeAll(() => {
  client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  fakeUser2 = new MockAPIUser(client, "TestUserTWO");

  interaction = new MockInteraction(client, undefined, undefined, fakeUser1);
  _interaction = new MockInteraction(client, undefined, undefined, fakeUser1, 1);
});

beforeEach(() => {
  embed = new EmbedBuilder(interaction).setDescription("test");
});

describe("Embed building", () => {
  it("Throws an exception when no Description is provided", () => {
    expect(() => {
      new EmbedBuilder(interaction).get();
    }).toThrow(InvalidEmbedDescriptionException);
  });

  /**
   * This tests the situation when the Command is supposed to respond with an Author
   * object, but got no user in return
   */
  it("Throws an exception when trying to set an empty Author", () => {
    expect(() => {
      new EmbedBuilder(interaction).setAuthor({ name: undefined }).get();
    }).toThrow(InvalidEmbedAuthorException);
  });

  it("Throws an exception when trying to create a timestamp from unacceptable parameter", () => {
    expect(() => {
      const timestamp = new Date("");

      new EmbedBuilder(interaction).setTimestamp(timestamp).get();
    }).toThrow(InvalidEmbedDateException);
  });

  it("Throws an exception when incomplete EmbedFields are provided", () => {
    expect(() => {
      new EmbedBuilder(interaction).addField("", "").get();
    }).toThrow(InvalidEmbedFieldsException);

    // In case the command gives incomplete EmbedFields object in return, it should throw an
    // exception, since both field name and value are required
    // The field values may be provided, but the strings can not be empty
    expect(() => {
      new EmbedBuilder(interaction).addField({ name: "", value: "" }).get();
    }).toThrow(InvalidEmbedFieldsException);
  });

  // This also covers using the first embed as Main - having the Author in the "header"
  it("Can set embed Author by default from the constructor", () => {
    // NOTE: we need a new embed for this test, declared locally
    const embed = new EmbedBuilder(interaction, true).setDescription("test").get();

    // We know that author is defined by the constructor, because we passed __true__
    // to the second parameter and our fake interaction has user defined,
    // but we need to tell TypeScript about that anyway
    expect(embed.author!.name).toBe(fakeUser1.username);
  });

  // We are choosing to set author from the start,
  // but we have to override that user with another fake user
  it("Can override the user on instantiation", () => {
    // NOTE: we also need a new embed for this test, declared locally
    const embed = new EmbedBuilder(interaction, true, fakeUser2).setDescription("test").get();

    expect(embed.author!.name).toBe(fakeUser2.username);

    // We also have to test it against a regular User type,
    // but on a new embed, since it depends on the instantiation
    const newEmbed = new EmbedBuilder(interaction, true, interaction.user).setDescription("test").get();
    expect(newEmbed.author!.name).toBe(interaction.user.username);
  });

  it("Can set and override embed description", () => {
    embed.setDescription("something_new");

    expect(embed.get().description).toBe("something_new");
  });

  it("Will use a default user from Interaction when no author is provided", () => {
    embed.setAuthor();

    // NOTE: author is guaranteed to be defined
    expect(embed.get().author!.name).toBe(fakeUser1.username);
  });

  it("Will use an overridden user when author is provided", () => {
    // NOTE: we can't cast FakeUser2 to MessageEmbedAuthor, we only need his name
    embed.setAuthor({ name: "TestUserTWO" });

    // NOTE: author is guaranteed to be defined after the call
    expect(embed.get().author!.name).toBe(fakeUser2.username);
  });

  it("Can set embed titles", () => {
    embed.setTitle("test title");

    expect(embed.get().title).toBe("test title");
  });

  it("Can set and override embed URLs", () => {
    const url1 = "http://google.com";
    const url2 = "http://discord.com";

    embed.setUrl(url1);
    expect(embed.get().url).toBe(url1);

    embed.setUrl(url2);
    expect(embed.get().url).toBe(url2);
  });

  it("Can prevent invalid embed URL", () => {
    expect(() => {
      embed.setUrl("qwert");
    }).toThrow(InvalidURLException);
  });

  it("Can set and override Embed Accent color", () => {
    const color1: ColorResolvable = "DARK_GOLD"; /* 12745742 */
    const color2: ColorResolvable = "#BD0000"; /* 12386304 */

    embed.setColor(color1);
    expect(embed.get().color).toBe(12745742); /* Discord converts colors to decimal */

    embed.setColor(color2);
    expect(embed.get().color).toBe(12386304);
  });

  it("Can set and override Embed Timestamp", () => {
    const timestamp1 = new Date(2021, 10, 10, 10, 10, 10, 10);
    const timestamp2 = new Date(2021, 20, 20, 20, 20, 20, 20);

    embed.setTimestamp(timestamp1);
    expect(embed.get().timestamp).toBe(timestamp1.getTime());

    embed.setTimestamp(timestamp2);
    expect(embed.get().timestamp).toBe(timestamp2.getTime());
  });

  it("Can set and override Embed Footer", () => {
    const footer1 = "something";
    const footer2: MessageEmbedFooter = { text: "something" };

    // The footer is guaranteed to be existing after the call
    embed.setFooter(footer1);
    expect(embed.get().footer!.text).toBe(footer1);

    embed.setFooter(footer2);
    expect(embed.get().footer!.text).toBe(footer2.text);
  });

  it("Can set and override Embed Thumbnails", () => {
    const thumbnail1 = "https://cdn.discordapp.com/embed/avatars/0.png";
    const thumbnail2: MessageEmbedThumbnail = { url: "https://cdn.discordapp.com/embed/avatars/1.png" };

    // The thumbnail is guaranteed to be existing after the call
    embed.setThumbnail(thumbnail1);
    expect(embed.get().thumbnail!.url).toBe(thumbnail1);

    embed.setThumbnail(thumbnail2);
    expect(embed.get().thumbnail!.url).toBe(thumbnail2.url);
  });

  it("Can prevent invalid Embed Thumbnail URLs", () => {
    expect(() => {
      embed.setThumbnail("qwertyui");
    }).toThrow(InvalidURLException);
    expect(() => {
      embed.setThumbnail(<MessageEmbedThumbnail>{ url: "qwertyui" });
    }).toThrow(InvalidURLException);
  });

  it("Can set and override Embed Image", () => {
    const image1 = "https://cdn.discordapp.com/embed/avatars/0.png";
    const image2: MessageEmbedImage = { url: "https://cdn.discordapp.com/embed/avatars/1.png" };

    // The image is guaranteed to be existing after the call
    embed.setImage(image1);
    expect(embed.get().image!.url).toBe(image1);

    embed.setImage(image2);
    expect(embed.get().image!.url).toBe(image2.url);
  });

  it("Can prevent invalid Embed Image URLs", () => {
    expect(() => {
      embed.setImage("qwertyu");
    }).toThrow(InvalidURLException);
    expect(() => {
      embed.setImage(<MessageEmbedImage>{ url: "qwertyui" });
    }).toThrow(InvalidURLException);
  });

  /** This will test both string and EmbedField parameters */
  it("Can add Embed Fields", () => {
    embed.addField("fieldName", "fieldValue");
    expect(embed.get().fields.length).toBe(1);

    const field: EmbedField = embed.get().fields[0];
    expect(field.name).toBe("fieldName");
    expect(field.value).toBe("fieldValue");

    embed.addField(<EmbedField>{ name: "fieldName2", value: "fieldValue2" });
    expect(embed.get().fields.length).toBe(2);

    // Check the newly added field, which should be on position 2
    const field2: EmbedField = embed.get().fields[1];
    expect(field2.name).toBe("fieldName2");
    expect(field2.value).toBe("fieldValue2");
  });

  it("Can add a row of Embed Fields (two columns)", () => {
    embed.addRow(<EmbedDoubleColumn>[
      { name: "fieldName1", value: "fieldValue1" },
      { name: "fieldName2", value: "fieldValue2" },
    ]);
    expect(embed.get().fields.length).toBe(2);
  });

  it("Can add a row of Embed Fields (two columns)", () => {
    embed.addRow(<EmbedTripleColumn>[
      { name: "fieldName1", value: "fieldValue1" },
      { name: "fieldName2", value: "fieldValue2" },
      { name: "fieldName2", value: "fieldValue2" },
    ]);
    expect(embed.get().fields.length).toBe(3);
  });

  it("Can extract Command Name from the interaction", () => {
    const commandName: string = new EmbedBuilder(interaction)["getCommandName"]();

    expect(commandName).toBe("testcommand");
  });

  // If this interaction was not of CommandInteraction type, this should throw an exception
  it("Can not extract command name from non-interaction type", () => {
    expect(() => {
      new EmbedBuilder(_interaction)["getCommandName"]();
    }).toThrow(InvalidCommandInteractionException);
  });
});
