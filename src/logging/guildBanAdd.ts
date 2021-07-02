import { Event } from 'nukejs';
import { send } from '../helper';
import { Guild, MessageEmbed, User } from 'discord.js';

import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'guildBanAdd',
            enabled: true,
        });
    }

    async run(guild: Guild, user: User) {
        const client = <HozolClient>guild.client;
        // Upgrade partial messages to full users
        if (user.partial) {
            await user.fetch();
        }

        // TODO: Add discipline records for bans not issued by the main bot.

        // Add a 1 second timeout to allow audit logs to process
        setTimeout(async () => {
            // Find out who applied the ban
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 5,
                type: 'MEMBER_BAN_ADD',
            });
            const auditLog = fetchedLogs.entries.find(
                (entry: any) => entry.target.id === user.id
            );

            // If the ban was executed by the bot
            if (auditLog && auditLog.executor.id === client.user?.id) {
                const bannedEmbedBot = new MessageEmbed()
                    .setAuthor(
                        `${client.user?.tag}`,
                        `${client.user?.displayAvatarURL({ dynamic: true })}`
                    )
                    .setTitle(':no_entry: User Banned')
                    .setDescription('A ban was applied on a user by the bot.')
                    .setColor('#DC3545')
                    .addField(
                        'User Banned',
                        `<@${user.id}> (${user.tag} / ${user.id})`
                    )
                    .addField(
                        'Reason for Ban',
                        `${
                            auditLog.reason
                                ? auditLog.reason
                                : 'Unspecified or Unknown'
                        }`
                    )
                    .setTimestamp()
                    .setFooter('The ban was applied by the bot');
                await send('banLogChannel', guild, '', {
                    embed: bannedEmbedBot,
                });
            } else if (auditLog && auditLog.executor) {
                // The ban was executed by someone else, either another bot or a member via Discord's ban
                const bannedEmbed = new MessageEmbed()
                    .setAuthor(
                        `${auditLog.executor.tag}`,
                        `${auditLog.executor.displayAvatarURL({
                            dynamic: true,
                        })}`
                    )
                    .setTitle(':no_entry: User Banned')
                    .setDescription('A user was banned from the guild.')
                    .setColor('#DC3545')
                    .addField(
                        'User Banned',
                        `<@${user.id}> (${user.tag} / ${user.id})`
                    )
                    .addField(
                        'Reason for Ban',
                        `${
                            auditLog.reason
                                ? auditLog.reason
                                : 'Unspecified or Unknown'
                        }`
                    )
                    .setTimestamp()
                    .setFooter(`Executor ID: ${auditLog.executor.id}`);
                await send('banLogChannel', guild, '', {
                    embed: bannedEmbed,
                });
            } else {
                // We do not know who executed the ban
                const bannedEmbedUnknown = new MessageEmbed()
                    .setAuthor('Unknown Executor')
                    .setTitle(':no_entry: User Banned')
                    .setDescription('A user was banned from the guild.')
                    .setColor('#DC3545')
                    .addField(
                        'User Banned',
                        `<@${user.id}> (${user.tag} / ${user.id})`
                    )
                    .addField('Reason for Ban', 'Unknown Reason')
                    .setTimestamp();
                await send('banLogChannel', guild, '', {
                    embed: bannedEmbedUnknown,
                });
            }
        }, 1000);
    }
};
