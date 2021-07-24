/* eslint-disable require-jsdoc */
import { Event } from 'nukejs';
import { createChannel, send } from '../helper';
import { GuildMember, MessageEmbed } from 'discord.js';
import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
            enabled: true,
        });
    }

    async run(member: GuildMember) {
        const client: HozolClient = <HozolClient>member.client;
        // Upgrade partial members to full members
        if (member.partial) {
            await member.fetch();
        }

        // get guild settings
        const guildSettings = await member.guild.settings();

        // Get moderation
        const modLogs = await member.moderation;

        // Send a join log
        const joinEmbed = new MessageEmbed()
            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
            .setTitle(':tada: Member joined the guild')
            .addField('Account Created On', `${client.moment(member.user.createdAt).format('LLLL Z')}`)
            .addField('Moderation Logs on Record', `${modLogs.length}`)
            .setFooter(`User ID: ${member.user.id}`)
            .setColor('#00ff00')
            .setTimestamp();
        await send('joinLogChannel', member.guild, '', {
            embed: joinEmbed,
        });

        // Re-assign permissions to incident channels
        member.guild.channels.cache
            .filter(
                (channel: any) =>
                    channel.type === 'text' &&
                    guildSettings.incidentsCategory &&
                    channel.parent &&
                    channel.parent.id === guildSettings.incidentsCategory &&
                    channel.topic.includes(`${member.user.id}|`)
            )
            .each((channel: any) => {
                channel.createOverwrite(
                    member,
                    {
                        ADD_REACTIONS: true,
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        EMBED_LINKS: true,
                        ATTACH_FILES: true,
                        READ_MESSAGE_HISTORY: true,
                    },
                    'Active incidents channel; user re-entered the guild.'
                );
                channel.send(
                    `:unlock: <@${member.user.id}> had (re-)entered the guild. Channel permissions were assigned so they can see it.`
                );
            });

        // Add a welcome incidents channel if set and one does not already exist for this member.
        if (guildSettings.welcomeIncidentText) {
            let welcomeChannel = member.guild.channels.cache.find(
                (channel: any) =>
                    channel.type === 'text' &&
                    guildSettings.welcomeCategory &&
                    channel.parent &&
                    channel.parent.id === guildSettings.welcomeCategory &&
                    channel.name.startsWith('welcome-') &&
                    channel.topic.includes(`${member.id}|`)
            );
            if (!welcomeChannel) {
                welcomeChannel = await createChannel('welcome', member.guild, [member]);
                // @ts-ignore
                welcomeChannel?.send(`<@${member.id}>, ${guildSettings.welcomeIncidentText}`);
            } else {
                console.dir(welcomeChannel);
            }
        }

        // Reassign saved roles, if any, to the member. Also, creates a settings entry in the database for them if it doesn't exist.
        // TODO
        /*
  const verifiedRole = member.guild.roles.resolve(
    member.guild.settings.verifiedRole
  );
  const muteRole = member.guild.roles.resolve(
    member.guild.settings.muteRole
  );
  */

        // Check if the member should be muted. If so, reset all roles
        // TODO: Use muted helper
        /*
  if (
    muteRole &&
    (member.settings.muted ||
      member.roles.cache.has(muteRole.id))
  ) {
    member.settings.update(`muted`, true, member.guild);
    member.roles.set(
      [member.guild.settings.muteRole],
      `User supposed to be muted`
    );
    await send(
      "modLogChannel",
      member.guild,
      `:mute: The member <@!${member.user.id}> had a mute on their account and was re-muted upon entering the guild. Check to be sure they were not trying to mute evade.`
    );
  } else {
    // Re-assign saved roles
    if (
      member.settings.verified &&
      member.settings.roles.length > 0
    ) {
      member.roles
        .set(member.settings.roles, `Re-assigning roles`)
        .then(async () => {
          // Verify the member if we are not in raid mitigation level 2+
          if (
            member.guild.settings.raidMitigation < 2 &&
            verifiedRole
          ) {
            member.roles.add(verifiedRole, `User is verified`);
          }
          await send(
            "generalChannel",
            member.guild,
            `**Welcome back** <@${member.id}>! I see you have been here before. I remembered the roles you had and all of your profile information / rewards. Please be sure to re-read the rules and information channels as things may have changed.`
          );
          await sails.helpers.xp.checkRoles(member);
        });
    } else if (member.settings.verified) {
      // Verify the member if we are not in raid mitigation level 2+
      if (member.guild.settings.raidMitigation < 2 && verifiedRole) {
        await send(
          "generalChannel",
          member.guild,
          `**Welcome back** <@${member.id}>! I see you have been here before. I remembered the roles you had and all of your profile information / rewards. Please be sure to re-read the rules and information channels as things may have changed.`
        );
        await sails.helpers.xp.checkRoles(member);
        member.roles.add(verifiedRole, `User is verified`);
      } else if (verifiedRole) {
        await send(
          "unverifiedChannel",
          member.guild,
          `**Welcome** <@${member.id}>! Please stand by for a short while, hopefully less than a couple hours; you had already previously passed verification, but due to an ongoing raid, I cannot let you have full guild access until the raid ends.`
        );
      }
    } else if (verifiedRole) {
      await send(
        "unverifiedChannel",
        member.guild,
        `**Welcome new member** <@${member.id}>! You are currently unverified and may not have access to the entire guild. Please check the information channels for instructions on how to get verified. You may talk with staff and other unverified members here in the meantime.`
      );
    } else {
      await send(
        "generalChannel",
        member.guild,
        `**Welcome new member** <@${member.id}>! Please check out the information channels for the rules and more information about us. Enjoy your stay!`
      );
    }
  }
  */

        if (client.moment().subtract(7, 'days').isBefore(client.moment(member.user.createdAt))) {
            // await send(
            //     "flagLogChannel",
            //     member.guild,
            //     `:clock7: Member <@${member.user.id}> (${member.user.id}) just joined the guild but their user account is less than 7 days old. Trolls often create new accounts, so keep an eye on them.`,
            //     {}
            // );
        }

        // TODO: Work on checking member's moderations
        // if ((await member.moderation).length > 0) {
        //     var logs = member.moderation.then(moderation  => {
        //         for(var i = 0; )
        //     })
        // if (logs.length > 0) {
        //     await send(
        //         "flagLogChannel",
        //         member.guild,
        //         `:police_officer: Member <@${member.user.id}> (${member.user.id}) just re-joined the guild. Keep an eye on them because they have ${logs.length} discipline records on their account. (they have ${member.HP} HP).`,
        //         {}

        //         );
        // }
        // }
    }
};
