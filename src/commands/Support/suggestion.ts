import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'suggestion',
            category: 'Support',
            runIn: ['text'],
            aliases: ['suggest'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            cooldown: 60,
            description: 'Make a suggestion for Hozol',
            enabled: true,
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        const embed = new MessageEmbed()
            .setTitle('Have a Suggestion?')
            .setDescription(
                "No matter how small or big your suggestion is, we're open to look into them. Go ahead and go to [https://github.com/VulpoTheDev/Hozol](https://github.com/VulpoTheDev/Hozol) and an **feature request** and fill in the issue with the relevant information"
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID ${message.author.id}`);
        await message.channel.send(embed);
    }
};
