import { GuildAuditLogs, GuildChannel, MessageEmbed } from 'discord.js';
import { Event } from 'nukejs';
import { checkTextChannel, send } from '../helper';
import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'channelDelete',
        });
    }

    async run(channel: GuildChannel) {
        // If a dm trigger this event, then don't even bother
        if (!channel.guild) return;

        // Assigns the client
        const client: HozolClient = <HozolClient>channel.client;

        // Gives the audit log a second to process
        setTimeout(async () => {
            // makes a varaiable containing the 5 audit logs that relates to deleting a channel
            const fetchedLogs: GuildAuditLogs = await channel.guild.fetchAuditLogs({
                limit: 5,
                type: 'CHANNEL_DELETE',
            });
            // Get the audit log channel that has the same id as the one tht was deleted
            const audits = fetchedLogs.entries.find((entry: any) => entry.target?.id === channel.id);
            // If the text channel is a text channel
            if (channel.guild && channel.type === 'text') {
                // Type Guard
                if (!checkTextChannel(channel)) return;
                let data = `ARCHIVE (cached messages only) of deleted text channel ${channel.name}, ID ${
                    channel.id
                }\nCreated on ${client.moment(channel.createdAt).format()}\nDeleted on ${client.moment().format()}\n\n`;

                // Iterate through the messages, sorting by ID, and add them to data
                const messages = channel.messages.cache;
                messages
                    .array()
                    .sort(function (a: any, b: any) {
                        return a.id - b.id;
                    })
                    .map((message) => {
                        // Write each message to data
                        data += `+++Message by ${message.author.username}#${message.author.discriminator} (${message.author.id}), ID ${message.id}+++\n`;
                        data += `-Time: ${client.moment(message.createdAt).format()}\n`;
                        // Write attachment URLs
                        message.attachments.array().map((attachment) => {
                            data += `-Attachment: ${attachment.url}\n`;
                        });
                        // Write embeds as JSON
                        message.embeds.map((embed) => {
                            data += `-Embed: ${JSON.stringify(embed)}\n`;
                        });
                        // Write the clean version of the message content
                        data += `${message.cleanContent}\n\n\n`;
                    });

                // Create a buffer with the data
                const buffer = Buffer.from(data, 'utf-8');

                // Send the buffer to the channel as a txt file
                const archiveEmbed = new MessageEmbed()
                    .setTitle(':wastebasket: A text channel was deleted.')
                    .addField(
                        'Deleted Channel',
                        `${channel.parent ? `${channel.parent.name} => ` : ''}${channel.name} (${channel.id})`
                    )
                    .setColor('#d81b60')
                    .setTimestamp();
                if (audits) {
                    archiveEmbed.setFooter(
                        `Deleted by ${audits.executor.tag} | User ID: ${audits.executor.id}`,
                        `${audits.executor.displayAvatarURL()}`
                    );
                }
                await send('channelLogChannel', channel.guild, '', {
                    files: [
                        {
                            attachment: buffer,
                            name: `${channel.name}.txt`,
                        },
                    ],
                    embed: archiveEmbed,
                });
            } else if (channel.guild) {
                const noArchiveEmbed = new MessageEmbed()
                    .setTitle(':wastebasket: A channel was deleted.')
                    .addField(
                        'Deleted Channel',
                        `${channel.parent ? `${channel.parent.name} => ` : ''}${channel.name} (${channel.id})`
                    )
                    .setColor('#d81b60')
                    .setTimestamp();
                if (audits) {
                    noArchiveEmbed.setFooter(
                        `Deleted by ${audits.executor.tag} | User ID: ${audits.executor.id}`,
                        `${audits.executor.displayAvatarURL()}`
                    );
                }
                await send('channelLogChannel', channel.guild, '', {
                    embed: noArchiveEmbed,
                });
            }
        }, 1000);
    }
};
