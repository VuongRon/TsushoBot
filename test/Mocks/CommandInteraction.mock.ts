import { MockUser } from "./User.mock";
import { Client, CommandInteraction, SnowflakeUtil } from "discord.js";
import { FakeInteractionOptions, FakeBasicInteractionOptions, FakeUser } from "./Types.mock";

/**
 * Creates a new Application Command Interaction, which can be Emitted for event listener tests
 *
 * @param {Client}                                                            client      Discord Client
 * @param {string | undefined}                                                channelId   Optional channel ID the event will be emitted to
 * @param {FakeInteractionOptions | FakeBasicInteractionOptions | undefined}  options     Optional interaction data if a custom interaction has to be created
 * @param {FakeUser | undefined}                                              user        Optional user data if the interaction has to come from a specific user
 */
export class MockInteraction extends CommandInteraction {
  constructor(
    client: Client,
    channelId?: string,
    options?: FakeInteractionOptions | FakeBasicInteractionOptions,
    user?: FakeUser,
    interactionType?: number
  ) {
    super(client, {
      application_id: SnowflakeUtil.generate(),
      channel_id: channelId ?? SnowflakeUtil.generate(),
      data: options ?? { id: SnowflakeUtil.generate(), name: "testcommand" },
      id: SnowflakeUtil.generate(),
      token: "",
      type: interactionType ?? 2,
      version: 1,
      user: user ?? new MockUser(user),
      guild_id: SnowflakeUtil.generate(),
    });
  }
}
