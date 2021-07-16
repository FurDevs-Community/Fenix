import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor, supportServerInvite } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'bug',
            category: 'Support',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            cooldown: 5,
            description: 'Report a bug about Hozol',
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
            .setTitle('Bug Report!?')
            .setDescription(
                `Oops a bug snuck into the Bot!? Go ahead and go to [https://github.com/VulpoTheDev/Hozol](https://github.com/VulpoTheDev/Hozol) and an **bug report** and fill in the issue with the relevant information and the dev team will take a look. While you're at it go ahead and join our support server ${supportServerInvite}`
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID ${message.author.id}`);
        await message.channel.send(embed);
    }
};
