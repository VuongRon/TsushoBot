import { Message, SnowflakeUtil, TextChannel } from "discord.js";
import { MockUser } from "./User.mock";
import { FakeUser } from "./Types.mock";

export class MockMessage extends Message {
  constructor(channel: TextChannel, messageContent?: string, author?: FakeUser) {
    super(channel.client, {
      attachments: [],
      channel_id: channel.id,

      content: messageContent ?? "test",
      edited_timestamp: "",
      embeds: [],
      id: SnowflakeUtil.generate(),
      author: author ?? new MockUser(author),
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().toString(),
      tts: false,
      type: 0,
      activity: { type: 1 },
      application: { id: SnowflakeUtil.generate(), name: "test" },
      application_id: "",
      components: [],
      guild_id: channel.guildId,
      nonce: "",
      sticker_items: [],
      webhook_id: "",
    });

    channel.messages.cache.set(this.id, this);
  }
}
