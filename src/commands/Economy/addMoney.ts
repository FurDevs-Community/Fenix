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
            name: 'addMoney',
            category: 'Economy',
            runIn: ['text'],
            aliases: ['addCoins'],
            userPerms: ['MANAGE_ROLES'],
            description: "Add money to the User's Wallet.",
            enabled: true,
            extendedHelp: "Add money to the User's Wallet.",
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
        if (!args)
            throw new Error(
                'You must provide a user you would like to add money to and the amount of money you would like to add'
            );
        const target = await message.guild?.members.cache.get((await usernameResolver(message, args[0])).id);
        if (!target) throw new Error('There was a problem getting the target specified');
        const moneyAdding = <number>(<unknown>args[1]);
        if (moneyAdding > 0 && isNaN(moneyAdding)) {
            target.addMoney(moneyAdding);
            const targetProfile = await target?.profile();
            const embed = new MessageEmbed()
                .setTitle(`Added Money to ${target.user.username}'s Wallet`)
                .addField('Money Added', moneyAdding)
                .addField('Wallet Balance', targetProfile.coins)
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`User ID`, message.author.username);
            message.channel.send(embed);
        }
    }
};
