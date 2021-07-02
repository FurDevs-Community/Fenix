import { Event } from 'nukejs';
import { checkTextChannel, send } from '../helper';
import { Message, MessageEmbed } from 'discord.js';
import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'messageDelete',
            enabled: true,
        });
    }

    async run(message: Message) {
        const client = <HozolClient>message.client;
        const guild: any = message.guild;
        // If the message is a partial, we can't do anything.
        if (message.partial) {
            // TODO: bot error log this
            return;
        }

        // TODO: find a way to log uncached messages, perhaps from raw events

        // Skip the bot
        if (message.author.id === client.user?.id) return;

        // Set a 1 second timeout to allow audit logs to process
        setTimeout(async () => {
            // Find out who deleted the message
            // Find out who kicked the member if they were kicked
            const fetchedLogs: any = await message.guild?.fetchAuditLogs({
                limit: 5,
                type: 'MESSAGE_DELETE',
            });
            const auditLog = fetchedLogs.entries.find(
                (entry: any) => entry.target.id === message.id
            );
            if (!checkTextChannel(message.channel)) return;

            // TODO

            // Remove XP/coins
            // await sails.helpers.xp.removeMessage(message);

            // Remove all rep earned from reactions, if any.
            // await sails.helpers.reputation.removeAll(message);

            // Remove all starboard
            // await sails.helpers.starboard.remove(message);

            // Create an embed for the event log channel
            const display = new MessageEmbed()
                .setTitle(':wastebasket: A message was deleted')
                .setDescription(`${message.cleanContent}`)
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setColor('#d81b60')
                .setTimestamp()
                .setFooter(
                    `Channel: ${
                        message.channel.parent
                            ? `${message.channel.parent.name} -> `
                            : ''
                    }${message.channel.name} | Channel ID: ${
                        message.channel.id
                    } | Message ID: ${message.id}`
                );
            if (auditLog) {
                display.setFooter(
                    `Deleted by ${auditLog.executor.tag} | User ID: ${
                        auditLog.executor.id
                    } | Channel: ${
                        message.channel.parent
                            ? `${message.channel.parent.name} -> `
                            : ''
                    }${message.channel.name} | Channel ID: ${
                        message.channel.id
                    } | Message ID: ${message.id}`,
                    `${auditLog.executor.displayAvatarURL({ dynamic: true })}`
                );
            }

            // Write attachment URLs
            message.attachments.array().map((attachment) => {
                display.addField(
                    'Contained Attachment',
                    JSON.stringify(attachment)
                );
            });
            // Write embeds as JSON
            message.embeds.map((embed) => {
                display.addField('Contained Embed', JSON.stringify(embed));
            });

            await send('messageLogChannel', guild, '', {
                embed: display,
            });
        }, 1000);
    }
};
