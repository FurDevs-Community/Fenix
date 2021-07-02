import HozolClient from '../lib/HozolClient';
import { Guild, MessageEmbed, User } from 'discord.js';
import { Event } from 'nukejs';
import { send } from '../helper';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'guildBanRemove',
            enabled: true,
        });
    }

    async run(guild: Guild, user: User) {
        const client = <HozolClient>guild.client;
        if (user.partial) {
            await user.fetch();
        }

        // TODO: appeal ban disciplines when bans are manually remove

        // Add a one second timeout for audit logs
        setTimeout(async () => {
            // Makes a varaible of the 5 audit logs that relates to unbanning a member
            const fetchedAuditLogs = await guild.fetchAuditLogs({
                limit: 5,
                type: 'MEMBER_BAN_REMOVE',
            });
            // get the audit log that relates to unbanning this specific member
            const auditLog = fetchedAuditLogs.entries.find(
                (entries: any) => entries.target?.id === user.id
            );
            // If Vulpo Unbanned that user
            // * When it comes to Unbanning People make sure your **always** provide a reason
            if (auditLog && auditLog?.executor.id === client.user?.id) {
                const embed = new MessageEmbed()
                    .setTitle('🔨 User has been Unbanned')
                    .setAuthor(
                        client.user.tag,
                        client.user.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription('A banned was remove by the bot')
                    .setColor('#dc3545')
                    .addField('User Unbanned', `${user.tag}`)
                    .addField(
                        'Reason for Unban',
                        `${
                            auditLog.reason
                                ? auditLog.reason
                                : 'No reason was specified'
                        }`
                    )
                    .addField(
                        'Moderation Logs',
                        'Do not forget to appeal the moderation relevant to this ban (if applicable)'
                    )
                    .setFooter('The ban was removed by the bot')
                    .setTimestamp();
                await send('banLogChannel', guild, '', {
                    embed: embed,
                });
                // If the ban wasen't lifted from the bot but the user
            } else if (auditLog && auditLog?.executor) {
                const embed = new MessageEmbed()
                    .setTitle('🔨 User has been Unbanned')
                    .setAuthor(
                        auditLog.executor.tag,
                        auditLog.executor.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(
                        `A banned was remove by the ${auditLog.executor.tag} (${auditLog.executor.id})`
                    )
                    .setColor('#dc3545')
                    .addField('User Unbanned', `${user.tag}`)
                    .addField(
                        'Reason for Unban',
                        `${
                            auditLog.reason
                                ? auditLog.reason
                                : 'No reason was specified'
                        }`
                    )
                    .addField(
                        'Moderation Logs',
                        'Do not forget to appeal the moderation relevant to this ban (if applicable)'
                    )
                    .setFooter(`Executer ID: ${auditLog.executor.id}`)
                    .setTimestamp();
                await send('banLogChannel', guild, '', {
                    embed: embed,
                });
                // If the ban information was unknown
            } else {
                const embed = new MessageEmbed()
                    .setTitle('🔨 User has been Unbanned')
                    .setAuthor(
                        'Unknown Executor',
                        'https://www.civhc.org/wp-content/uploads/2018/10/question-mark-768x768.png'
                    )
                    .setDescription('A banned was remove by the bot')
                    .setColor('#dc3545')
                    .addField('User Unbanned', `${user.tag}`)
                    .addField('Reason for Unban', 'Unknown Reason')
                    .addField(
                        'Moderation Logs',
                        'Do not forget to appeal the moderation relevant to this ban (if applicable)'
                    )
                    .setTimestamp();
                await send('banLogChannel', guild, '', {
                    embed: embed,
                });
            }
        }, 1000);
    }
};
