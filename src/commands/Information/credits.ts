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
            name: 'credits',
            category: 'Information',
            runIn: ['text'],
            aliases: ['contributors', 'authors', 'developers'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'See who contributed to the Hozol Development.',
            enabled: true,
            extendedHelp: 'See who contributed to the Hozol Development.',
            usage: '[Username|Mention|ID]',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();
        const botCreator = await client.users.fetch('679145795714416661');
        const credits = [
            {
                names: ['Sector Seven#3820', 'LostNuke#9114'],
                contributions: 'Help out with the Development of Hozol and NukeJS',
            },
            {
                names: ['That Duck David#9502'],
                contributions:
                    'Support & Helped out Hozol with Suggestions and Feedbacks During the Development of Hozol',
            },
        ];

        const creditsEmbed = new MessageEmbed()
            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('Credits - Bot Developers and Supporters')
            .setDescription('Please give a warm thanks to the people who made this bot possible:')
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(
                `Bot Creator: ${botCreator.tag} | User ID: ${message.author.id}`,
                botCreator.displayAvatarURL({ dynamic: true })
            );
        credits.map((credit) =>
            creditsEmbed.addField(`${credit.names.map((name) => `**${name}**`).join(', ')}`, credit.contributions)
        );
        await message.channel.send(creditsEmbed);
    }
};
