import { Guild, SnowflakeUtil, TextChannel } from "discord.js";

export class MockTextChannel extends TextChannel {
  constructor(guild: Guild, channelId?: string) {
    super(guild, { id: channelId ?? SnowflakeUtil.generate(), type: 0, name: "test-channel" }, guild.client);

    guild.channels.cache.set(this.id, this);
  }
}
