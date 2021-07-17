import { randomUUID } from 'crypto';
import { GuildAuditLogs, GuildChannel, MessageEmbed } from 'discord.js';
import { Event } from 'nukejs';
import { Loggings } from '../database';
import { checkTextChannel, send } from '../helper';
import { dashboardBaseURL } from '../settings';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'channelCreate',
        });
    }

    async run(channel: GuildChannel) {
        // If a dm trigger this event, then don't even bother
        if (!channel.guild) return;
        let loggingMessage: any;
        const settings = await channel.guild.settings();
        // Gives a second for audit logs to process
        setTimeout(async () => {
            // Grabs the 5 audit logs that invloves a channel being created
            const fetchedLogs: GuildAuditLogs = await channel.guild.fetchAuditLogs({
                limit: 5,
                type: 'CHANNEL_CREATE',
            });

            const ChannelCreateLog = new Loggings({
                logID: randomUUID(),
                logType: 'Channel Create',
                logInfo: `A Channel by the name of ${channel.name}(${channel.id}) has been create!`,
                // ! TEMP
                thumbnail: 'https://cdn.discordapp.com/attachments/729818605121699931/865392177596596244/Simp-1.png',
            });

            // With those fetched autit logs filter the one with the id that matches the channel that was created
            const audits = fetchedLogs.entries.find((entry: any) => entry.target?.id === channel.id);
            // If it was a text channel, then send an embed saying that channel it's creating tagging that channel
            if (channel.type === 'text') {
                // Type Guard
                if (!checkTextChannel(channel)) return;
                if (!settings.compactLogging) {
                    loggingMessage = new MessageEmbed()
                        .setTitle('✨ A Text Channel was Created')
                        .addField(
                            'Channel',
                            `${channel.parent ? `${channel.parent.name} => ` : ''} ${channel.name} (${channel.id})`
                        )
                        .addField('Check it out', `${channel}`)
                        .setColor('#06F10A')
                        .setTimestamp();
                    if (settings.logLoggings) {
                        loggingMessage.addField(
                            '✅ Logged into the Database',
                            `You should be able to see it in ${dashboardBaseURL}/dashboard/guild/731520035717251142/logs/${ChannelCreateLog.logID}`
                        );
                    }
                    if (audits) {
                        loggingMessage.setFooter(
                            `Created by ${audits.executor.tag}| User ID ${audits.executor.id}`,
                            audits.executor.displayAvatarURL({ dynamic: true })
                        );
                        ChannelCreateLog.responsible = `${audits.executor.tag} | ${audits.executor.id}`;
                    } else {
                        loggingMessage = `✨ **Channel Created**: ${channel.name} (${channel})`;
                    }
                }
                if (settings.logLoggings) {
                    await ChannelCreateLog.save();
                }

                if (settings.compactLogging) {
                    return send('channelLogChannel', channel.guild, `${loggingMessage}`, {});
                } else {
                    return send('channelLogChannel', channel.guild, '', {
                        embed: loggingMessage,
                    });
                }
            } else {
                const loggingMessage = new MessageEmbed()
                    .setTitle('✨ A Channel was Created')
                    .addField(
                        'Channel',
                        `${channel.parent ? `${channel.parent.name} => ` : ''} ${channel.name} (${channel.id})`
                    )
                    .setColor('#06F10A')
                    .setTimestamp();
                if (audits) {
                    loggingMessage.setFooter(
                        `Created by ${audits.executor.tag}| User ID ${audits.executor.id}`,
                        audits.executor.displayAvatarURL({ dynamic: true })
                    );
                    ChannelCreateLog.responsible = `${audits.executor.tag} | ${audits.executor.id}`;
                }
                if (settings.logLoggings) {
                    await ChannelCreateLog.save();
                    loggingMessage.addField(
                        '✅ Logged into the Database',
                        `You should be able to see it in ${dashboardBaseURL}/dashboard/guild/731520035717251142/logs/${ChannelCreateLog.logID}`
                    );
                }
                return send('channelLogChannel', channel.guild, '', {
                    embed: loggingMessage,
                });
            }
        }, 1000);
    }
};
