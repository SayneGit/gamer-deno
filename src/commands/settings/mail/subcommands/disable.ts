import { botCache } from "../../../../../mod.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { guildsDatabase } from "../../../../database/schemas/guilds.ts";

createSubcommand("settings-mails", {
  name: "disable",
  aliases: ["off"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: (message) => {
    guildsDatabase.updateOne({ guildID: message.guildID }, {
      $set: { mailsEnabled: false },
    });

    botCache.helpers.reactSuccess(message);
  },
});
