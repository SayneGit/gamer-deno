import { createGuildRole } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/handlers/guild.ts";
import { botHasChannelPermissions } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/utils/permissions.ts";
import { Permissions } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/types/permission.ts";
import { botCache, cache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { Channel } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/structures/channel.ts";
import { editChannel } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/handlers/channel.ts";
import { OverwriteType } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/types/guild.ts";

createSubcommand("settings", {
  name: "mute",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.BOT_OWNER],
  botServerPermissions: ["ADMINISTRATOR"],
  arguments: [
    { name: "type", type: "string", literals: ["setup", "disable"] },
  ],
  execute: async function (message, args: SettingsMuteArgs, guild) {
    if (!guild) return;

    if (args.type === "disable") {
      db.guilds.update(message.guildID, { muteRoleID: "" });
      return botCache.helpers.reactSuccess(message);
    }

    // Run the setup

    const settings = await db.guilds.get(message.guildID);
    if (
      settings?.muteRoleID && guild.roles.has(settings.muteRoleID)
    ) {
      return botCache.helpers.reactError(message);
    }

    const role = await createGuildRole(message.guildID, { name: "Muted" });
    await db.guilds.update(message.guildID, { muteRoleID: role.id });

    guild.channels.forEach((channel) => {
      // If the permissions are synced with the category channel skip
      if (channel.parentID) {
        const category = guild.channels.get(channel.parentID);
        if (!category) return;
        if (isChannelSynced(channel.id)) return;
      }

      // Update the channel perms
      editChannel(
        channel.id,
        {
          overwrites: [
            ...channel.permissions,
            {
              id: role.id,
              type: OverwriteType.ROLE,
              allow: [],
              deny: ["VIEW_CHANNEL"],
            },
          ],
        },
      );
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMuteArgs {
  type: "setup" | "disable";
}

// TODO: remove when in discordeno
function isChannelSynced(channelID: string) {
  const channel = cache.channels.get(channelID);
  if (!channel?.parentID) return false;

  const category = cache.channels.get(channel.parentID);
  if (!category) return false;

  return channel.permission_overwrites?.every((overwrite) => {
    const perm = category.permission_overwrites?.find((o) =>
      o.id === overwrite.id
    );
    if (!perm) return false;
    if (
      overwrite.allow !== perm.allow || overwrite.deny !== perm.deny
    ) {
      return false;
    }
    return true;
  });
}
