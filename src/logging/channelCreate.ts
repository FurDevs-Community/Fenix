import { GuildAuditLogs, GuildChannel, MessageEmbed } from 'discord.js';
import { Event } from 'nukejs';
import { checkTextChannel, send } from '../helper';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'channelCreate',
        });
    }

    async run(channel: GuildChannel) {
        // If a dm trigger this event, then don't even bother
        if (!channel.guild) return;
        // Gives a second for audit logs to process
        setTimeout(async () => {
            // Grabs the 5 audit logs that invloves a channel being created
            const fetchedLogs: GuildAuditLogs =
                await channel.guild.fetchAuditLogs({
                    limit: 5,
                    type: 'CHANNEL_CREATE',
                });
            // With those fetched autit logs filter the one with the id that matches the channel that was created
            const audits = fetchedLogs.entries.find(
                (entry: any) => entry.target?.id === channel.id
            );
            // If it was a text channel, then send an embed saying that channel it's creating tagging that channel
            if (channel.type === 'text' && channel.guild) {
                // Type Guard
                if (!checkTextChannel(channel)) return;
                const createdEmbed = new MessageEmbed()
                    .setTitle('✨ A Text Channel was Created')
                    .addField(
                        'Channel',
                        `${
                            channel.parent ? `${channel.parent.name} => ` : ''
                        } ${channel.name} (${channel.id})`
                    )
                    .addField('Check it out', `${channel}`)
                    .setColor('#06F10A')
                    .setTimestamp();
                if (audits) {
                    createdEmbed.setFooter(
                        `Created by ${audits.executor.tag}| User ID ${audits.executor.id}`,
                        audits.executor.displayAvatarURL({ dynamic: true })
                    );
                }
                // TODO: Check if the user wants the log to be shown on the dashboard, then log it into the Logging Model
                return send('channelLogChannel', channel.guild, '', {
                    embed: createdEmbed,
                });
                // If it's not a text channel, then just mention a channel and not tag it
            } else if (channel.guild) {
                const createdEmbed = new MessageEmbed()
                    .setTitle('✨ A Channel was Created')
                    .addField(
                        'Channel',
                        `${
                            channel.parent ? `${channel.parent.name} => ` : ''
                        } ${channel.name} (${channel.id})`
                    )
                    .setColor('#06F10A')
                    .setTimestamp();
                if (audits) {
                    createdEmbed.setFooter(
                        `Created by ${audits.executor.tag}| User ID ${audits.executor.id}`,
                        audits.executor.displayAvatarURL({ dynamic: true })
                    );
                    // TODO: Check if the user wants the log to be shown on the dashboard, then log it into the Logging Model
                    return send('channelLogChannel', channel.guild, '', {
                        embed: createdEmbed,
                    });
                }
            }
        }, 1000);
    }
};
