import { botCache } from "../../../../../../mod.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import { createSubcommand } from "../../../../../utils/helpers.ts";
import type { guildsDatabase } from "../../../../../database/schemas/guilds.ts";

createSubcommand("settings-mails-questions", {
  name: "add",
  aliases: ["a"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "label", type: "...string", lowercase: true },
  ],
  execute: async function (message, args: SettingsMailsQuestionsRemoveArgs) {
    const settings = await guildsDatabase.findOne({ guildID: message.guildID });
    if (!settings) return botCache.helpers.reactError(message);

    if (
      !settings.mailQuestions.some((q) => q.name.toLowerCase() !== args.label)
    ) {
      return botCache.helpers.reactError(message);
    }

    guildsDatabase.updateOne(
      {
        guildID: message.guildID,
      },
      {
        $set: {
          mailQuestions: settings.mailQuestions.filter((q) =>
            q.name.toLowerCase() !== args.label
          ),
        },
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMailsQuestionsRemoveArgs {
  label: string;
}
