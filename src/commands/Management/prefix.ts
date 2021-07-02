import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from 'nukejs';
import { updatePrefix } from './../../database';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'prefix',
            category: 'Management',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            userPerms: ['MANAGE_GUILD'],
            cooldown: 0,
            description:
                "View the Bot's current prefix or change the bot's behaviors by changing it's prefix",
            enabled: true,
            extendedHelp:
                "View ths bot's current prefix and change the bot's prefix so it'll respond to commands with a different prefix.",
            usage: '[New Prefix]',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        await message.delete();
        const prefix = args[0];
        const settings = await message.guild.settings();
        if (!prefix) {
            const embed = new MessageEmbed()
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle('Current Prefix')
                .setDescription(
                    `The current prefix for \`${message.guild?.name}\` is \`${settings.prefix}\`. If you would like to change the prefix do \`${settings.prefix}prefix [prefix]\``
                )
                .setTimestamp()
                .setFooter(`User ID: ${message.author.tag}`)
                .setColor(primaryColor);
            message.channel.send(embed);
        } else if (prefix && message.guild?.settings) {
            if (prefix.length > 5) {
                throw new Error(
                    'The prefix is too long please keep it below 5 character.'
                );
            } else if (prefix === settings.prefix) {
                throw new Error(
                    "You cannot set a prefix that's already your current prefix"
                );
            } else {
                await updatePrefix(message.guild.id, prefix);
                const settings = await message.guild.settings();
                const embed = new MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setTitle('New Prefix')
                    .setDescription(
                        `The new prefix for \`${message.guild?.name}\` is \`${settings.prefix}\`. You can change it any time by doing \`${settings.prefix}prefix [prefix]\``
                    )
                    .setTimestamp()
                    .setFooter(`User ID: ${message.author.id}`)
                    .setColor(primaryColor);
                message.channel.send(embed);
            }
        }
    }
}
