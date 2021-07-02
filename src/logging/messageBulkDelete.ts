import { Event } from 'nukejs';
import { checkTextChannel, send } from '../helper';
import { Collection, Message, MessageEmbed, Snowflake } from 'discord.js';
import HozolClient from '../lib/HozolClient';

module.exports = class extends Event {
    constructor() {
        super({
            name: 'messageDeleteBulk',
            enabled: true,
        });
    }

    async run(messages: Collection<Snowflake, Message>) {
        const client = <HozolClient>messages.first()?.client;
        const guild: any = messages.first()?.guild;
        // TODO: figure out how to capture bulk deleter via audit logs

        let data = '';
        messages
            .array()
            .sort(function (a: any, b: any) {
                return a.id - b.id;
            })
            .map(async (message) => {
                // TODO

                // Remove XP/coins
                // await sails.helpers.xp.removeMessage(message);

                // Remove all rep earned from reactions, if any.
                // await sails.helpers.reputation.removeAll(message);

                // Remove all starboard
                // await sails.helpers.starboard.remove(message);

                // Write each message to data
                if (!checkTextChannel(message.channel)) return;
                data += `+++Message by ${message.author.username}#${message.author.discriminator} (${message.author.id}), ID ${message.id}, channel ${message.channel.name}+++\n`;
                data += `-Time: ${client.moment(message.createdAt).format()}\n`;
                // Write attachment URLs
                message.attachments.array().map((attachment) => {
                    data += `-Attachment: ${attachment.url}\n`;
                });
                // Write embeds as JSON
                message.embeds.forEach((embed) => {
                    data += `-Embed: ${JSON.stringify(embed)}\n`;
                });
                // Write the clean version of the message content
                data += `${message.cleanContent}\n\n\n`;
            });

        // Create a buffer with the data
        const buffer = Buffer.from(data, 'utf-8');

        // Embed
        const display = new MessageEmbed()
            .setTitle(':wastebasket: :wastebasket: Bulk messages were deleted.')
            .setColor('#d81b60')
            .setTimestamp();

        // Send the buffer to the staff channel as a txt file
        await send('messageLogChannel', guild, '', {
            files: [
                {
                    attachment: buffer,
                    name: `bulkDelete_${client.moment().valueOf()}.txt`,
                },
            ],
            embed: display,
        });
    }
};
