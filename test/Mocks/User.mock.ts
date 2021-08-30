import {
  Client,
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  MessageEmbedAuthor,
  SnowflakeUtil,
  User,
} from "discord.js";
import { FakeUser } from "./Types.mock";

/**
 * Creates a quick test user for Interactions. Omitting the optional data creates a new user with random ID/Discriminator
 */
export class MockUser {
  public id: string;
  public discriminator: string;
  public username: string;
  public avatar: string;

  constructor(user?: FakeUser) {
    // Use fake data when the user was empty
    this.id = user?.id ?? SnowflakeUtil.generate();
    this.discriminator = user?.discriminator ?? MockUser.makeDiscriminator();
    this.username = user?.username ?? "testUser";
    this.avatar = user?.avatar ?? "https://cdn.discordapp.com/embed/avatars/0.png";
  }

  /** Creates a new, random User Discriminator - 4 digits number */
  public static makeDiscriminator(): string {
    return SnowflakeUtil.generate().substr(-4);
  }
}

export class MockAPIUser extends User {
  constructor(client: Client, username?: string, id?: string) {
    super(client, { id: id ?? SnowflakeUtil.generate(), username: username ?? "testUser" });
  }
}
