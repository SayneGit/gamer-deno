import type { editChannel } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { labelsDatabase } from "../../../../database/schemas/labels.ts";
import { mailsDatabase } from "../../../../database/schemas/mails.ts";

createSubcommand("labels", {
  name: "set",
  arguments: [{ name: "name`", type: "string", lowercase: true }],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_CHANNELS"],
  execute: async (message, args: LabelsDeleteArgs) => {
    const labelToSet = await labelsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!labelToSet) return botCache.helpers.reactError(message);

    const mail = await mailsDatabase.findOne({
      channelID: message.channelID,
    });

    if (!mail) botCache.helpers.reactError(message);

    return editChannel(message.channel, { parent_id: labelToSet.categoryID });
  },
});

interface LabelsDeleteArgs {
  name: string;
}
