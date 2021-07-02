/* eslint-disable require-jsdoc */
import { GuildMember } from 'discord.js';

/**
 *  This will add a role to a Guild Member and will return true or false whether
 *  user has the role or not.
 *
 * @param member - Guild Member
 * @param role - Role Type
 * @param reason - Reason why we're giving that role to that user
 * @returns Whether the Guild Member has the role or not
 * @example addRole(<Member>, "muteRole", "The user has been muted by the bot")
 *
 */

export async function addRole(
    member: GuildMember,
    role: 'muteRole' | 'botModRole' | 'verifiedRole' | 'botManagerRole',
    reason: string
) {
    const guildSettings = await member.guild.settings();

    // Setting not set? Exit.
    if (!guildSettings[role]) return false;

    // Setting set, but role does not exist? Return false.
    if (!member.guild.roles.cache.has(guildSettings[role])) return false;

    // If the member has the role, return false.
    if (member.roles.cache.has(guildSettings[role])) return true;

    // If we reach here, add the role.
    await member.roles.add(guildSettings[role], reason);
    return true;
}
