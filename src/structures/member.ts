import type { MemberCreatePayload } from "../../deps.ts";

import { rawAvatarURL, structures } from "../../deps.ts";

function createMember(data: MemberCreatePayload, guildID: string) {
  return {
    id: data.user?.id,
    joinedAt: Date.parse(data.joined_at),
    guildID,
    tag: `${data.user?.username}#${data.user?.discriminator}`,
    avatarURL: rawAvatarURL(
      data.user?.id,
      data.user?.discriminator,
      data.user?.avatar,
    ),
  };
}

// deno-lint-ignore ban-ts-comment
// @ts-ignore
structures.createMember = createMember;

declare module "../../deps.ts" {
  interface Member {
    id: string;
    joinedAt: number;
    tag: string;
    avatarURL: string;
    mention: string;
  }
}