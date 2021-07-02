import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { usernameResolver } from '../../helper';
import { numberToEmoji } from '../../helper/general/numberedEmojis';
import HozolClient from '../../lib/HozolClient';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'rep',
            category: 'Reputation',
            runIn: ['text'],
            aliases: [],
            cooldown: 5000,
            description: `A a single reputation to a user`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: HozolClient) {
        if (!message.guild) return;
        if (!args)
            throw new Error(
                'Please provide an user you would like to give a rep to'
            );
        const userTarget = await usernameResolver(
            message,
            args.slice(0).join(' ')
        );
        const target = await message.guild.members.cache.get(userTarget.id);
        if (!target) throw new Error("Couldn't get the member");
        const before = await (await target.profile()).reputation;
        const success = await target.addReputation(1);
        const reps = await (await target.profile()).reputation;
        if (success) {
            const embed = new MessageEmbed()
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle(`Added Reps to ${target.user.username}`)
                .addField(
                    `Reps:`,
                    `${numberToEmoji(before)} ➡️ ${numberToEmoji(reps)}`
                )
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            message.channel.send(embed);
        } else {
            throw new Error('An Error Ocurred adding reputation to the user');
        }
    }
};
