import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { usernameResolver } from '../../helper';
import { numberToEmoji } from '../../helper/general/numberedEmojis';
import HozolClient from '../../lib/HozolClient';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'addreps',
            category: 'Reputation',
            runIn: ['text'],
            aliases: ['addrep'],
            cooldown: 0,
            description: `Add reputation in bulk to a user`,
            enabled: true,
            ignoredInhibitors: [],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        if (!args[0]) throw new Error('Please provide an user you would like to add reps to');
        if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) > 0)
            throw new Error('Please provide an valid amount of reps you would like to give');
        const userTarget = await usernameResolver(message, args[0]);
        const target = await message.guild.members.cache.get(userTarget.id);
        if (!target) throw new Error("Couldn't get the member");
        const before = await (await target.profile()).reputation;
        console.log(before);
        const success = await target.addReputation(parseInt(args[1]));
        const reps = await (await target.profile()).reputation;
        console.log(reps);
        if (success) {
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`Added Reps to ${target.user.username}`)
                .addField(`Reps:`, `${numberToEmoji(before)} ➡️ ${numberToEmoji(reps)}`)
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            message.channel.send(embed);
        } else {
            throw new Error('An Error Ocurred adding reputation to the user');
        }
    }
};
