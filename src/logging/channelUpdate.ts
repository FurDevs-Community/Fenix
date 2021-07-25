import { GuildAuditLogs, GuildChannel, MessageEmbed } from 'discord.js';
import { Event } from 'nukejs';
import { checkTextChannel, checkVoiceChannel, send } from '../helper';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'channelUpdate',
        });
    }

    async run(oldChannel: GuildChannel, newChannel: GuildChannel) {
        // If a dm trigger this event, then don't even bother
        if (!newChannel.guild) return;

        // Assigns the client

        setTimeout(async () => {
            // makes a varaiable containing the 5 audit logs that relates to deleting a channel
            const fetchedLogs: GuildAuditLogs = await newChannel.guild.fetchAuditLogs({
                limit: 5,
                type: 'CHANNEL_UPDATE',
            });
            // Get the audit log channel that has the same id as the one tht was deleted
            const audits = fetchedLogs.entries.find((entry: any) => entry.target?.id === newChannel.id);

            if (audits && audits.executor.id) {
                const embed = new MessageEmbed()
                    .setTitle('🔄 A Channel was updated')
                    .setAuthor(audits.executor.tag, audits.executor.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${newChannel} (${newChannel.id}) settings has been updated!`)
                    .setColor('#6610f2')
                    .setTimestamp()
                    .setFooter(`Executor's ID: ${audits.executor.id}`);
                let changes = false;

                // Determine if there's any changes in the name
                const oldName = oldChannel.name;
                const newName = newChannel.name;

                if (oldName !== newName) {
                    embed.addField('Slowmode Settings were changed', `${oldName} => ${newName}`);
                    changes = true;
                }

                if (newChannel.type === 'text') {
                    if (!checkTextChannel(newChannel)) return;
                    if (!checkTextChannel(oldChannel)) return;
                    // Determine if there's any changes in the topic
                    const oldTopic = oldChannel.topic || 'No Topic were set';
                    const newTopic = newChannel.topic || 'No Topic were set';

                    // Determine if there's any changes in the nsfw toggle
                    const oldNSFW = oldChannel.nsfw;
                    const newNSFW = newChannel.nsfw;

                    // Determine if there's any changes in the slow mode
                    const oldSlowmode = oldChannel.rateLimitPerUser;
                    const newSlowmode = newChannel.rateLimitPerUser;

                    if (oldTopic !== newTopic) {
                        embed.addField('Channel Topics Before', `\`\`\`${oldTopic}\`\`\``);

                        embed.addField('Channel Topics After', `\`\`\`${newTopic}\`\`\``);
                        changes = true;
                    }

                    if (oldNSFW !== newNSFW) {
                        embed.addField(
                            'NSFW Settings were changed',
                            `${oldNSFW ? 'Enabled' : 'Disabed'} => ${newNSFW ? 'Enabled' : 'Disabled'}`
                        );
                        changes = true;
                    }

                    if (oldSlowmode !== newSlowmode) {
                        embed.addField(
                            'Slowmode Settings were changed. Format: (hh:mm:ss)',
                            `${new Date(oldSlowmode * 1000).toISOString().substr(11, 8)} => ${new Date(
                                newSlowmode * 1000
                            )
                                .toISOString()
                                .substr(11, 8)}`
                        );
                        changes = true;
                    }
                } else if (newChannel.type === 'voice') {
                    if (!checkVoiceChannel(newChannel)) return;
                    if (!checkVoiceChannel(oldChannel)) return;

                    // Determine if there's any changes in the nsfw toggle
                    const oldBitrate = oldChannel.bitrate;
                    const newBitrate = newChannel.bitrate;

                    // Determine if there's any changes in the nsfw toggle
                    const oldUserlimit = oldChannel.userLimit;
                    const newUserlimit = newChannel.userLimit;

                    if (oldBitrate !== newBitrate) {
                        embed.addField('Bitrate Settings were changed', `${oldBitrate} => ${newBitrate}`);
                        changes = true;
                    }

                    if (oldUserlimit !== newUserlimit) {
                        embed.addField('User Limit Settings were changed', `${oldUserlimit} => ${newUserlimit}`);
                        changes = true;
                    }
                }
                if (changes) {
                    send('channelLogChannel', newChannel.guild, '', {
                        embed: embed,
                    });
                }
            }
        }, 1000);
    }
};
