import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { primaryColor } from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'serverinfo',
            category: 'Information',
            runIn: ['text'],
            aliases: ['si', 'server', 'guild', 'guildinfo'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'See information on this guild.',
            enabled: true,
            extendedHelp:
                "See infomration about a guild containing information such as it's name, id, owner, amount of members that are online, offline, in total, as well as roles, channels, emojis, boosters and ban count the server has",
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
        const serverEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL() || message.author.defaultAvatarURL)
            .setTitle(`Server information - ${message.guild.name}`)
            .addField('Server name: ', message.guild.name, true)
            .addField('Server ID: ', message.guild.id, true)
            .addField('Server Owner: ', message.guild.owner, true)
            .addField(
                'Online Member: ',
                message.guild.members.cache.filter((member) => member.presence.status === 'online').size,
                true
            )
            .addField(
                'Offline Member:',
                message.guild.members.cache.filter((member) => member.presence.status === 'offline').size,
                true
            )
            .addField('Total Members: ', message.guild.members.cache.size, true)
            .addField('Total Roles: ', message.guild.roles.cache.size, true)
            .addField('Total Emojis: ', message.guild.emojis.cache.size, true)
            .addField(
                'Total Booster: ',
                `${
                    message.guild.premiumSubscriptionCount
                        ? `${message.guild.premiumSubscriptionCount}`
                        : 'Nobody has boosted the server.'
                }`,
                true
            )
            .addField('Ban Count:', (await message.guild.fetchBans()).size, true)
            .setColor(primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(serverEmbed);
    }
};
