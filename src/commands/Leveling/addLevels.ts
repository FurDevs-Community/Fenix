import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { usernameResolver } from '../../helper';
import { getXPFromLevel } from '../../helper/leveling/leveling';
import { Profiles } from '../../database';
import { primaryColor } from './../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'addlevel',
            category: 'Leveling',
            runIn: ['text'],
            aliases: ['addlevels'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Add Levels to a user.',
            enabled: true,
            extendedHelp: 'Add levels to a user.',
            userPerms: ['MANAGE_GUILD'],
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
        if (!args[0]) throw new Error('Please provide a user you would like to add levels');
        const target = await usernameResolver(message, args[0]);
        if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) > 0)
            throw new Error('Please provide how many levels you would want to add to this user');
        const member = message.guild?.members.cache.get(target.id);
        const levelToXP = getXPFromLevel(parseInt(args[1]));
        const memberProfile = await message.member!.profile();
        await Profiles.findOne(
            { guildID: message.guild.id, userID: member!.user.id },
            { XP: levelToXP + memberProfile.XP }
        ).then((data) => {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`Added ${args[1]} Levels to ${target.username}`)
                .setDescription(`${target.username} is now at level ${data?.XP}`)
                .setColor(primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            message.channel.send(embed);
        });
    }
};
