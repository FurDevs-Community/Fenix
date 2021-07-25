import HozolClient from '../../lib/HozolClient';
import { GuildMember, Message, MessageEmbed, User } from 'discord.js';
import { Command } from 'nukejs';
import { usernameResolver } from '../../helper';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        /**
         * @param {any} file
         */
        super(file, {
            name: 'avatar',
            category: 'Information',
            runIn: ['text'],
            aliases: ['ua'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: "Displays the user's avatar.",
            enabled: true,
            usage: '[Username|Mention|ID]',
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
        let user;
        if (args[0]) {
            await usernameResolver(message, args[0]).then((resolved: User) => {
                user = resolved;
            });
        }
        const target =
            // @ts-ignore
            <GuildMember>message.guild.members.cache.get(user?.id) || message.member;
        const avatarEmbed = new MessageEmbed()
            .setAuthor(`${target.user.tag}`, `${target.user.displayAvatarURL({ dynamic: true })}`)
            .setTitle(`👓 ${target.user.username}'s Avatar!`)
            .setImage(`${target.user.displayAvatarURL({ dynamic: true })}?size=512`)
            .setTimestamp()
            .setFooter(`Requester ID: ${target.user.id}`);
        return message.channel.send(avatarEmbed);
    }
};
