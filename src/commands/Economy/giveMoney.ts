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
            name: 'givemoney',
            category: 'Economy',
            runIn: ['text'],
            aliases: ['givecoins', 'give'],
            description: "Gives money to the User's Wallet.",
            enabled: true,
            extendedHelp: "Gives money to the User's Wallet.",
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
                'You must provide a user you would like to give money to and the amount of money you would like to give'
            );
        const guildSettings = await message.guild.settings();
        const giver = await message.member;
        let giversCoins = await (await message.member?.profile())!.coins;
        const receiver = await message.guild?.members.cache.get((await usernameResolver(message, args[0])).id);
        if (!giver && receiver) throw new Error('There was a problem getting the target specified');
        const moneyGiving = parseInt(args[1]);
        if (moneyGiving > 0 && !isNaN(moneyGiving) && moneyGiving <= giversCoins) {
            if ((await receiver?.addMoney(moneyGiving)) && giver?.removeMoney(moneyGiving)) {
                giversCoins = await (await giver?.profile())!.coins;
                const receiversCoins = await (await receiver?.profile())!.coins;
                const embed = new MessageEmbed()
                    .setTitle(`Given Money to ${receiver!.user.username}'s Wallet`)
                    .addField('Money Giving/Given', `${guildSettings.currency}${moneyGiving}`)
                    .addField(`Giver's (${giver.user.username}) Balance`, `${guildSettings.currency}${giversCoins}`)
                    .addField(
                        `Receivers's (${receiver?.user.username}) Balance`,
                        `${guildSettings.currency}${receiversCoins}`
                    )
                    .setColor(primaryColor)
                    .setTimestamp()
                    .setFooter(`User ID ${message.author.username}`);
                message.channel.send(embed);
            } else {
                throw new Error('There was an issue adding money to that user');
            }
        } else {
            throw new Error(
                `Please make sure the money you're adding is greater than 1 and is a number and you cannot give the user more than what you have`
            );
        }
    }
};
