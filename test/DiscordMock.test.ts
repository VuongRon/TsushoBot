import {
  Client,
  CommandInteraction,
  Guild,
  Intents,
  Interaction,
  Message,
  SnowflakeUtil,
  TextChannel,
  User,
} from "discord.js";
import { MockAPIUser, MockUser } from "./Mocks/User.mock";
import { FakeUser } from "./Mocks/Types.mock";
import { MockInteraction } from "./Mocks/CommandInteraction.mock";
import { MockGuild } from "./Mocks/Guild.mock";
import { MockTextChannel } from "./Mocks/TextChannel.mock";
import { MockMessage } from "./Mocks/Message.mock";

let client: Client;

let guildId: string;
let guild: Guild;
let guildFromId: Guild;

let channelId: string;
let channel: TextChannel;
let channelFromId: TextChannel;

let message: Message;
let customMessage: Message;

// Interactions are tested only upon Event Emission
let interaction: Interaction;
let customInteraction: CommandInteraction;
const customCommandInteractionName = "testcommand";

let user: FakeUser;

// Custom user doesn't have to be recreated on each test
let customUser: FakeUser;
let APIUser: User;

// It is important to recreate the client on each test, because guilds
// and channels are cached within the client, so we need to start fresh every time
beforeEach(() => {
  client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  guildId = SnowflakeUtil.generate();
  guild = new MockGuild(client);
  guildFromId = new MockGuild(client, guildId);

  channelId = SnowflakeUtil.generate();
  channel = new MockTextChannel(guild);
  channelFromId = new MockTextChannel(guild, channelId);

  message = new MockMessage(channel);
  customMessage = new MockMessage(channel, "something");

  interaction = new MockInteraction(client);
  // Create an application command interaction in already created channel
  customInteraction = new MockInteraction(client, channel.id, {
    id: SnowflakeUtil.generate(),
    name: customCommandInteractionName,
  });

  user = new MockUser();
  customUser = {
    id: "12345678",
    discriminator: "1234",
    username: "FakeUser",
    avatar: "",
  };
  APIUser = new MockAPIUser(client);
});

describe("Can Mock Discord Client and its elements", () => {
  it("Creates an accessible client", () => {
    // Client is created upon instantiation
    expect(client).toBeDefined();
  });

  it("Creates an accessible Guild", () => {
    expect(guild).toBeDefined();

    // We also have to check if the guild was properly cached within the client
    expect(client.guilds.cache.get(guild.id)).toBeDefined();
  });

  it("Creates an accessible Guild with custom ID", () => {
    expect(guildFromId).toBeDefined();

    // Check if it's retrievable by the created ID
    expect(client.guilds.cache.get(guildId)).toBeDefined();
  });

  it("Creates an accessible TextChannel", () => {
    // A Guild is required in order to create any Channel
    expect(channel).toBeDefined();

    // It should also be present in the Cache
    expect(guild.channels.cache.get(channel.id)).toBeDefined();
  });

  it("Creates an accessible TextChannel with custom ID", () => {
    expect(channelFromId).toBeDefined();

    // Check if it's retrievable by the created ID
    expect(guild.channels.cache.get(channelId)).toBeDefined();
  });

  it("Creates a readable Message", () => {
    expect(message).toBeDefined();

    // Check if this message has been cached
    expect(channel.messages.cache.get(message.id)).toBeDefined();
  });

  it("Creates a readable Message with custom content", () => {
    expect(customMessage).toBeDefined();

    // Check if this message has been cached
    expect(channel.messages.cache.get(customMessage.id)).toBeDefined();
  });

  it("Can detect fake interaction emits", () => {
    // Make sure at least one assertion has to be called
    expect.assertions(1);

    // NOTE: the types have to strictly match
    // globally, the interaction has to be declared with Interaction type
    // even if CommandInteraction type is being assigned, it still inherits from
    // Interaction, but the signature will still match.
    // interaction: CommandInteraction is a different signature, so this listener
    // will not pick this event up
    client.on("interactionCreate", (interaction: Interaction) => {
      // The type of assertion does not matter, it only has to be called inside the listener,
      // but just in case we have to make sure that Interaction is defined correctly.
      // The test will fail if emission was not picked up by this listener. This will either
      // tell us that the Listener Signature was mismatched or there was a problem with emissions
      expect(interaction).toBeDefined();
    });

    // Fake an emission
    client.emit("interactionCreate", interaction);
  });

  it("Can detect custom application command interaction", () => {
    expect.assertions(1);

    client.on("interactionCreate", (interaction: Interaction) => {
      // We know that our interaction is a slash command, but we have to let TypeScript
      // know about this by a performing a type check
      // This will also tell us if the Type of interaction was properly set to APPLICATION_COMMAND (2)
      if (!interaction.isCommand()) return;

      expect(interaction.commandName).toBe(customCommandInteractionName);
    });

    client.emit("interactionCreate", customInteraction);
  });

  it("Can detect fake message emits", () => {
    expect.assertions(1);

    // Refer to the above explanation on event register
    client.on("messageCreate", (message: Message) => {
      expect(message).toBeDefined();
    });

    client.emit("messageCreate", message);
  });

  it("Can create fake/custom users", () => {
    expect(user).toBeDefined();

    // Should be as same as the definition
    expect(customUser).toStrictEqual({
      id: "12345678",
      discriminator: "1234",
      username: "FakeUser",
      avatar: "",
    });

    expect(APIUser.username).toBe("testUser");
  });
});
