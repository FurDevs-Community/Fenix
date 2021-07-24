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
            name: 'information',
            category: 'Information',
            runIn: ['text', 'dm'],
            aliases: ['info'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: "Get the bot's infomration.",
            enabled: true,
            extendedHelp: "Get the bot's information.",
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('Bot Infomation')
            .setDescription(
                'Hozol is an Open Source General Purpose Discord bot with handful of commands, unique moderation and useful features to help out your server in such ways'
            )
            .addField(
                'Report an Issue',
                `(Open an GitHub Issue)[https://github.com/VulpoTheDev/Hozol/issues/new?assignees=VulpoTheDev&labels=bug&template=bug_report.md&title=%5BBug%5D]]`
            )
            .addField(
                'Request a Feature/Suggestion                ',
                `(Open an GitHub Issue)[https://github.com/VulpoTheDev/Hozol/issues/new?assignees=VulpoTheDev&labels=enhancement&template=feature_request.md&title=[Suggestion]]`
            )
            .addField('Report an Issue', `(Open an GitHub Issue)[https://github.com/VulpoTheDev/Hozol]`)
            .addField('Report an Issue', `(Open an GitHub Issue)[https://github.com/VulpoTheDev/Hozol-Website]`)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
