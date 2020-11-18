import { Embed } from "./../../utils/Embed.ts";
import { botID, cache, sendMessage } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `stats`,
  guildOnly: true,
  execute: (message, _args) => {
    let totalMemberCount = 0;
    let cachedMemberCount = 0;

    for (const guild of cache.guilds.values()) {
      totalMemberCount += guild.memberCount;
    }

    for (const member of cache.members.values()) {
      cachedMemberCount += member.guilds.size;
    }

    const embed = new Embed()
      .setTitle("Gamer Bot Stats")
      .setColor("random")
      .addField("Guilds:", cache.guilds.size.toLocaleString(), true)
      .addField("Total Members:", totalMemberCount.toLocaleString(), true)
      .addField("Cached Members:", cachedMemberCount.toLocaleString(), true)
      .addField("Channels:", cache.channels.size.toLocaleString(), true)
      .addField("Messages:", cache.messages.size.toLocaleString(), true)
      .addField("Deno Version:", `v${Deno.version.deno}`, true)
      .setTimestamp();

    return sendMessage(message.channelID, { embed });
  },
});
