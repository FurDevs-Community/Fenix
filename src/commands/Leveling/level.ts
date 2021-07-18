import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';
import { getLevelFromXP, getXPFromLevel } from '../../helper/leveling/leveling';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'level',
            category: 'Leveling',
            runIn: ['text'],
            aliases: ['latency'],
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
        await message.delete();
        const profile = await message.member?.profile();
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('Leveling Card!')
            .addField(`XP`, `${profile?.XP!}/${getXPFromLevel(getLevelFromXP(profile?.XP!) + 1)}`, true)
            .addField(`Level`, getLevelFromXP(profile?.XP!), true)
            .addField(
                `Progression to Level up`,
                `${Math.floor((profile?.XP! / getXPFromLevel(getLevelFromXP(profile?.XP!) + 1)) * 100)}%`
            )
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
