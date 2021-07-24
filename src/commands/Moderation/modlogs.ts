import HozolClient from '../../lib/HozolClient';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import { userResolver } from '../../helper';

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
        if (!message.guild) return;
        if (!args[0])
            throw new Error("Hey please specify a username, mention or the user's id of whoever you're looking at");
        const user = await userResolver(client, args[0]);
        const moderations = await user.guildModeration(message.guild.id);
        const embed = new MessageEmbed();
        embed.setTitle(`**__Moderation Actions on ${user.tag}__**\n\n`);
        if (moderations.length > 0) {
            moderations.map((moderation) => {
                embed.addField(
                    `**[${moderation.appealed ? 'APPEALED' : 'NOT APPEALED'}]**`,
                    `\nCase: **${moderation.cases}**\nRules Violated: ${moderation.rules}\nReason: ${moderation.reason}`
                );
            });
        } else {
            embed.addField(
                'No Moderation Actions!',
                'This user does not have any Moderation Actions Logged into the bot'
            );
        }
        embed.setColor(primaryColor).setTimestamp().setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
