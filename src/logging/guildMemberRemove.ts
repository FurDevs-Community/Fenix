/* eslint-disable require-jsdoc */
import { Event } from 'nukejs';
import { send } from '../helper';
import { GuildMember, MessageEmbed } from 'discord.js';
import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'guildMemberRemove',
            enabled: true,
        });
    }

    async run(member: GuildMember) {
        const client: HozolClient = <HozolClient>member.client;
        // Upgrade partial members to full members
        // Can't do anything if the guild member is a partial
        if (member.partial) {
            return;
        }

        // Get guild settings
        const guildSettings = await member.guild.settings();

        // get mod logs
        const modLogs = await member.moderation();

        // TODO: Add discipline logs for kicks if not done by the bot

        // Set a 1 second timeout to allow audit logs to come through
        setTimeout(async () => {
            // Find out who kicked the member if they were kicked
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 5,
                type: 'MEMBER_KICK',
            });
            const auditLog = fetchedLogs.entries.find(
                (entry: any) => entry.target?.id === member.id
            );

            // If the kick was executed by the bot
            if (auditLog && auditLog.executor.id === client.user?.id) {
                const kickedEmbedBot = new MessageEmbed()
                    .setAuthor(
                        `${client.user?.tag}`,
                        `${client.user?.displayAvatarURL({ dynamic: true })}`
                    )
                    .setTitle(':athletic_shoe: User kicked')
                    .setDescription(
                        'A member was kicked from the guild by the bot.'
                    )
                    .setColor('#DC3545')
                    .addField(
                        'User Kicked',
                        `<@${member.id}> (${member.user.tag} / ${member.id})`
                    )
                    .addField(
                        'Reason for Kick',
                        `${
                            auditLog.reason
                                ? auditLog.reason
                                : 'Unspecified or Unknown'
                        }`
                    )
                    .setFooter('The kick was executed by the bot')
                    .setTimestamp();
                await send('kickLogChannel', member.guild, '', {
                    embed: kickedEmbedBot,
                });
            } else if (auditLog && auditLog.executor) {
                // The kick was executed by someone else, either another bot or a member via Discord's kick
                const kickedEmbed = new MessageEmbed()
                    .setAuthor(
                        `${auditLog.executor.tag}`,
                        `${auditLog.executor.displayAvatarURL({
                            dynamic: true,
                        })}`
                    )
                    .setTitle(':athletic_shoe: User kicked')
                    .setDescription('A member was kicked from the guild.')
                    .setColor('#DC3545')
                    .addField(
                        'User Kicked',
                        `<@${member.id}> (${member.user.tag} / ${member.id})`
                    )
                    .addField(
                        'Reason for Kick',
                        `${
                            auditLog.reason
                                ? auditLog.reason
                                : 'Unspecified or Unknown'
                        }`
                    )
                    .setFooter(`Executor ID: ${auditLog.executor.id}`)
                    .setTimestamp();
                await send('kickLogChannel', member.guild, '', {
                    embed: kickedEmbed,
                });
            } else if (auditLog) {
                // We do not know who executed the kick
                const kickedEmbedUnknown = new MessageEmbed()
                    .setAuthor('Unknown Executor')
                    .setTitle(':athletic_shoe: User kicked')
                    .setDescription('A member was kicked from the guild.')
                    .setColor('#DC3545')
                    .addField(
                        'User Kicked',
                        `<@${member.id}> (${member.user.tag} / ${member.id})`
                    )
                    .addField('Reason for Kick', 'Unknown Reason')
                    .setTimestamp();
                await send('kickLogChannel', member.guild, '', {
                    embed: kickedEmbedUnknown,
                });
            }
        }, 1000);

        // send a log to the channel
        const leaveEmbed = new MessageEmbed()
            .setAuthor(
                `${member.user.tag}`,
                `${member.user.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle(':wave: Member left the guild.')
            .addField(
                'Time Spent in Guild',
                `${client.moment
                    .duration(
                        client.moment().diff(client.moment(member.joinedAt)),
                        'milliseconds'
                    )
                    .format()}`
            )
            .addField('Moderation Logs on Record', `${modLogs.length}`)
            .setFooter(`User ID: ${member.user.id}`)
            .setColor('#00b8ff')
            .setTimestamp();
        await send('leaveLogChannel', member.guild, '', {
            embed: leaveEmbed,
        });

        // Finalize any bans if the member has them
        // TODO
        // await sails.helpers.member.applyBans(member);

        // Remove any invites created by the member; this helps prevent raids (user enters guild, creates invite, leaves, stages raid with the invite)

        // TODO
        /*
  member.guild.fetchInvites().then((invites) => {
    invites
      .filter(
        (invite) =>
          typeof invite.inviter === "undefined" ||
          invite.inviter === null ||
          invite.inviter.id === member.id
      )
      .each(async (invite) => {
        await send(
          "eventLogChannel",
          member.guild,
          `:wastebasket: The invite ${invite.code} was deleted because an inviter did not exist. They probably left the guild.`
        );
      });
  });
  */

        // Remove any of the member's purchased advertisements
        // TODO
        /*
  member.guild.ads
    .filter((ad) => ad.userID === member.id)
    .map((ad) => Caches.get("ads").delete(ad.id));
    */

        // Delete any open support channels created by the member immediately
        member.guild.channels.cache
            .filter(
                (channel: any) =>
                    channel.type === 'text' &&
                    guildSettings.incidentsCategory &&
                    channel.parentID === guildSettings.incidentsCategory &&
                    channel.name.startsWith('support-') &&
                    channel.topic.includes(`${member.id}|`)
            )
            .map((channel) => channel.delete('Member left the guild'));

        // Post in other incidents channels
        member.guild.channels.cache
            .filter(
                (channel: any) =>
                    channel.type === 'text' &&
                    guildSettings.incidentsCategory &&
                    channel.parentID === guildSettings.incidentsCategory &&
                    channel.topic.includes(`${member.id}|`)
            )
            .map((channel: any) =>
                channel.send(`:wave: Member <@${member.id}> left the guild.`)
            );

        // Post in general if the member left within 1 hour of joining
        // TODO
        /*
  if (
    moment().subtract(1, "hours").isBefore(moment(member.joinedAt))
  ) {
    await send(
      "generalChannel",
      member.guild,
      `:frowning: O-oh, <@${member.user.id}> did not want to stay after all.`
    );
  }
  */
    }
};
