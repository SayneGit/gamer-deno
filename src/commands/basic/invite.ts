import { botCache } from "../../../mod.ts";
import { botID, sendMessage } from "../../../deps.ts";
import { translate } from "../../utils/i18next.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `invite`,
  execute: function (message) {
    sendMessage(
      message.channelID,
      [
        `${botCache.constants.emojis.coin} **${
          translate(message.guildID, "commands/invite:INVITE_BOT")
        }:** <https://discordapp.com/oauth2/authorize?client_id=${botID}&scope=bot&permissions=336067670>`,
        "",
        `${botCache.constants.emojis.bot} **${
          translate(message.guildID, "commands/invite:NEED_SUPPORT")
        }:** discord.gg/J4NqJ72`,
      ].join("\n"),
    );
  },
});
