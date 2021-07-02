/* eslint-disable require-jsdoc */
import { Guild } from 'discord.js';

import { uid } from './../';

export async function createChannel(
    type:
        | 'support'
        | 'interrogation'
        | 'discipline'
        | 'inactive'
        | 'inquiry'
        | 'welcome',
    guild: Guild,
    members: any
) {
    const guildSettings = await guild.settings();

    // Cannot create one of the incidents category is not set!
    if (!guildSettings.incidentsCategory) {
        throw new Error(
            `Discord: cannot create ${type} incident channel for guild ${guild.name} because no incidentsCategory was set.`
        );
        return;
    }

    const memberString: any[] = [];
    const overwrites: any[] = [];

    // DISABLED: For now, we are instructing members to set these permissions on the incidents category themselves.

    /*
  // Grant staff permissions on inquiry
  if (["inquiry"].includes(type) && guildSettings.staffRole) {
    overwrites.push({
      id: guildSettings.staffRole,
      allow: [
        "ADD_REACTIONS",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "MENTION_EVERYONE",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
      ],
      type: "role",
    });
  }
  // Grant mod permissions on everything
  if (guildSettings.botModRole) {
    overwrites.push({
      id: guildSettings.botModRole,
      allow: [
        "ADD_REACTIONS",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "MANAGE_MESSAGES",
        "MENTION_EVERYONE",
        "MANAGE_ROLES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
      ],
      type: "role",
    });
  }
  */

    // Add permissions for each provided member, and add them to the channel topic for automation
    if (members && members.forEach) {
        members.forEach((member: { id: any }) => {
            memberString.push(member.id);
            overwrites.push({
                id: member.id,
                options: {
                    ADD_REACTIONS: true,
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                },
            });
        });
    }

    // Create the channel
    const channel = await guild.channels.create(`${type}-${await uid()}`, {
        type: 'text',
        topic: `${type} channel. Members (used by bot): |${memberString.join(
            '|'
        )}|`,
        parent: guildSettings.incidentsCategory,
        rateLimitPerUser: 15,
    });

    // Sync default permissions
    await channel.lockPermissions();

    // Now apply overwrites
    const maps = overwrites.map(async (overwrite) => {
        await channel.updateOverwrite(
            overwrite.id,
            overwrite.options,
            `${type} channel`
        );
    });
    await Promise.all(maps);

    return channel;
}
