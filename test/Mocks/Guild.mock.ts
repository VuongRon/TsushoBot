import { Client, Guild, SnowflakeUtil } from "discord.js";

export class MockGuild extends Guild {
  constructor(client: Client, guildId?: string) {
    super(client, {
      id: guildId ?? SnowflakeUtil.generate(),
      name: "TestGuild",
      icon: null,
      splash: null,
      owner_id: "",
      region: "",
      afk_channel_id: null,
      afk_timeout: 0,
      verification_level: 0,
      default_message_notifications: 0,
      explicit_content_filter: 0,
      roles: [],
      emojis: [],
      features: [],
      mfa_level: 0,
      application_id: null,
      system_channel_flags: 0,
      system_channel_id: null,
      widget_enabled: false,
      widget_channel_id: null,
      discovery_splash: "",
      rules_channel_id: "",
      vanity_url_code: "",
      description: "",
      banner: "",
      premium_tier: 1,
      preferred_locale: "en-US",
      public_updates_channel_id: "0",
      nsfw_level: 0,
      stickers: [],
    });

    this.client.guilds.cache.set(this.id, this);
  }
}
