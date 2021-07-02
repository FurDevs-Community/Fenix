import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'unlock',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['MANAGE_CHANNELS'],
            userPerms: ['MANAGE_CHANNELS'],
            description: 'Unlock a channel',
            enabled: true,
            extendedHelp:
                "Unlock a channel preventing everyone with the verified role won't be able to send message.",
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
        const channel =
            <TextChannel>message.guild?.channels.cache.get(args[0]) ||
            message.mentions.channels.first() ||
            message.channel;
        let duration: number;
        let reason: string;
        const settings = await message.guild.settings();
        const memberRole = settings?.verifiedRole;
        if (!memberRole) {
            throw new Error(
                'You need to set up a verified role (the verified role is like how members are able to get full access of the server)'
            );
        }
        if (channel.permissionsFor(memberRole)?.has('SEND_MESSAGES'))
            throw new Error('This channel is not locked');
        const botPosition = message.guild?.me?.roles.highest.position;
        const verifiedRolePosition =
            message.guild?.roles.cache.get(memberRole)?.position;
        if (botPosition! <= verifiedRolePosition!) {
            throw new Error(
                `The bot's highest role (${
                    message.guild?.me?.roles.highest
                }) must be above the verified role (${message.guild?.roles.cache.get(
                    memberRole
                )}) in order to lock that channel`
            );
        } else {
            channel
                .updateOverwrite(settings?.verifiedRole!, {
                    SEND_MESSAGES: true,
                    ADD_REACTIONS: true,
                })
                .then(() => {
                    const channelName = channel.name.split('-');
                    if (channelName[0] === '🔒') {
                        channel.setName(channelName.slice(1).join(' '));
                    }
                    const embed = new MessageEmbed()
                        .setTitle('🔓 CHANNEL UNLOCKED 🔓')
                        .setDescription('This channel has been unlocked')
                        .setAuthor(
                            `Issued By: ${message.author.tag}`,
                            message.author.displayAvatarURL({ dynamic: true })
                        )
                        .setTimestamp()
                        .setFooter(`User ID: ${message.author.id}`)
                        .setColor('GREEN');
                    if (duration) {
                        embed.addField('Duration', duration);
                    }
                    if (reason) {
                        embed.addField('Reason', reason);
                    }
                    channel.send(embed);
                })
                .catch((e) => {
                    throw new Error(e);
                });
        }
    }
}
