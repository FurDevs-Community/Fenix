/* eslint-disable require-jsdoc */
import { GuildMember } from 'discord.js';

/**
 *
 * @param member - Guild Member
 * @param role - Role Type
 * @param reason - Reason why we're removing that role to that user
 * @returns Whether the Guild Member no longer the role or not
 * @example removeRole(<Member>, "muteRole", "The user has been unmuted by the bot")
 */

export async function removeRole(
    member: GuildMember,
    role: 'muteRole' | 'botModRole' | 'verifiedRole' | 'botManagerRole',
    reason: string
) {
    const guildSettings = await member.guild.settings();

    // Setting not set? Exit.
    if (!guildSettings[role]) return false;

    // Setting set, but role does not exist? Return false.
    if (!member.guild.roles.cache.has(guildSettings[role])) {
        return false;
    }

    // If the member has the role, return false.
    if (member.roles.cache.has(guildSettings[role])) return true;

    // If we reach here, remove the role.
    await member.roles.remove(guildSettings[role], reason);
    return true;
}
