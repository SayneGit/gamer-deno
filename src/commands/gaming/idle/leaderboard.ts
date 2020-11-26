import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "leaderboard",
  aliases: ["leaderboards", "lb"],
  cooldown: {
    seconds: 120,
  },
  execute: async function (message) {
    const users = await db.idle.get(message.author.id);
    if (!users) return botCache.helpers.reactError(message);

    const profiles = (await db.idle.findMany({}, true)).sort((a, b) => {
      const diff = BigInt(b.currency) - BigInt(a.currency);
      if (diff === BigInt(0)) return 0;
      if (BigInt(b.currency) > BigInt(a.currency)) return 1;
      return -1;
    });

    const embed = botCache.helpers.authorEmbed(message)
      .setDescription([
        ...profiles.map(
          (usr, index) =>
            `${index + 1}. ${
              (cache.members.get(usr.id)?.tag || usr.id).padEnd(20, " ")
            } **${
              botCache.helpers.cleanNumber(
                BigInt(usr.currency).toLocaleString(),
              )
            }** 💵`,
        ),
        "-----------",
        `${message.author.username.padEnd(20)} **${
          botCache.helpers.cleanNumber(BigInt(users.currency).toLocaleString())
        }** 💵`,
      ].join("\n"))
      .setFooter(translate(message.guildID, "strings:IDLE_CACHE"));

    sendEmbed(message.channelID, embed);
  },
});
