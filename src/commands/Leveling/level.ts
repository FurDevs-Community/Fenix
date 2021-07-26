import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import { getLevelFromXP, getXPFromLevel } from '../../helper/leveling/leveling';
import { usernameResolver } from '../../helper';
import { GuildMember } from 'discord.js';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'level',
            category: 'Leveling',
            runIn: ['text'],
            aliases: ['levels'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: "Get a user's level.",
            enabled: true,
            extendedHelp: "Get a user's level.",
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
        let target = message.member as GuildMember;
        if (args[0])
            target = <GuildMember>(
                await message.guild.members.cache.get((await usernameResolver(message, args.slice(0).join(' '))).id)
            );
        if (!target) throw new Error('There was an issue getting this user');
        const profile = await target.profile();
        const embed = new MessageEmbed()
            .setAuthor(`${target.user.username}`, `${target.user.displayAvatarURL({ dynamic: true })}`)
            .setTitle('Leveling Card!')
            .addField(`XP`, `${profile?.XP!}/${getXPFromLevel(getLevelFromXP(profile?.XP!) + 1)}`, true)
            .addField(`Level`, getLevelFromXP(profile?.XP!), true)
            .addField(
                `Progression to Level up`,
                `${Math.floor((profile?.XP! / getXPFromLevel(getLevelFromXP(profile?.XP!) + 1)) * 100)}%`
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${target.user.id}`);
        message.channel.send(embed);
    }
};
