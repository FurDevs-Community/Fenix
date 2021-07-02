import HozolClient from '../../lib/HozolClient';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { usernameResolver } from '../../helper/resolvers/usernameResolver';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'modlogs',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['ml', 'logs', 'infractions', 'cases'],
            botPerms: ['EMBED_LINKS', 'MANAGE_MESSAGES'],
            userPerms: ['MANAGE_MESSAGES'],
            description: 'View the modlogs of a user',
            enabled: true,
            extendedHelp: "View a user's modlogs.",
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        await message.delete();
        if (!args[0])
            throw new Error(
                "Hey please specify a username, mention or th user's id of whoever you're looking at"
            );
        const user = await usernameResolver(message, args[0]);
        const member = await message.guild?.members.cache.get(user.id);
        if (member) {
            const moderations = await member.moderation();
            const embed = new MessageEmbed();
            embed.setTitle(`**__Moderation Actions on ${user.tag}__**\n\n`);
            if (moderations.length > 0) {
                moderations.map((moderation) => {
                    embed.addField(
                        `**[${
                            moderation.appealed ? 'APPEALED' : 'NOT APPEALED'
                        }]**`,
                        `\nCase: **${moderation.cases}**\nRules Violated: ${moderation.rules}\nReason: ${moderation.reason}`
                    );
                });
            } else {
                embed.addField(
                    'No Moderation Actions!',
                    'This user does not have any Moderation Actions Logged into the bot'
                );
            }
            embed
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            message.channel.send(embed);
        } else {
            throw new Error('Make sure that member is in the guild');
        }
    }
}
