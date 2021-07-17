import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import { usernameResolver } from '../../helper';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'removemoney',
            category: 'Economy',
            runIn: ['text'],
            aliases: ['removecoins'],
            userPerms: ['MANAGE_ROLES'],
            description: "Remove money to the User's Wallet.",
            enabled: true,
            extendedHelp: "Remove money to the User's Wallet.",
            usage: '',
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
        if (!args)
            throw new Error(
                'You must provide a user you would like to remove money to and the amount of money you would like to remove'
            );
        const guildSettings = await message.guild.settings();
        const target = await message.guild?.members.cache.get((await usernameResolver(message, args[0])).id);
        if (!target) throw new Error('There was a problem getting the target specified');
        const moneyRemoving = parseInt(args[1]);
        if (moneyRemoving > 0 && !isNaN(moneyRemoving)) {
            if (await target.removeMoney(moneyRemoving)) {
                const targetProfile = await target?.profile();
                const embed = new MessageEmbed()
                    .setTitle(`Added Money to ${target.user.username}'s Wallet`)
                    .addField('Money Removed', `-${guildSettings.currency}${moneyRemoving}`)
                    .addField('Wallet Balance', `${guildSettings.currency}${targetProfile.coins}`)
                    .setColor(primaryColor)
                    .setTimestamp()
                    .setFooter(`User ID: ${message.author.id}`);
                message.channel.send(embed);
            } else {
                throw new Error('There was an issue removing money to that user');
            }
        } else {
            throw new Error(`Please make sure the money you're removing is greater than 1 and is a number`);
        }
    }
};
