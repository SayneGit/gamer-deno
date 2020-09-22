import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v9/src/utils/cache.ts";
import {
  deleteMessage,
  botHasChannelPermissions,
  Permissions,
  botID,
  bgBlue,
  getTime,
  bgYellow,
  black,
} from "../../deps.ts";
import { botCache } from "../../mod.ts";
import { parseCommand } from "./commandHandler.ts";

botCache.monitors.set("modmail", {
  name: "modmail",
  botChannelPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  execute: async function (message) {
    const channel = cache.channels.get(message.channelID);

    // If this is not a support channel
    if (!channel?.topic?.includes("gamerSupportChannel")) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${
        bgYellow(black("collector"))
      }] Executed.`,
    );

    if (
      botHasChannelPermissions(message.channelID, [Permissions.MANAGE_MESSAGES])
    ) {
      deleteMessage(message, "", 10);
    }

    if (message.author.bot && message.author.id !== botID) {
      deleteMessage(message);
    }

    const command = parseCommand(message.content.split(" ")[0]);
    if (command?.name === "mail") return;

    botCache.commands.get("mail")
      ?.execute?.(
        message,
        { content: message.content },
        cache.guilds.get(message.guildID),
      );
  },
});
