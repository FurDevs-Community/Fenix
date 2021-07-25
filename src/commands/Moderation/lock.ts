import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'nukejs';
import ms from 'ms';
import { checkTextChannel } from '../../helper/typeguards/isTextChannel';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'lock',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['MANAGE_CHANNELS'],
            userPerms: ['MANAGE_CHANNELS'],
            description: 'Lock a channel',
            enabled: true,
            extendedHelp: "Lock a channel preventing everyone with the verified role won't be able to send message.",
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
        let channel: TextChannel;
        let duration: number;
        let reason: string;
        if (args[0]) {
            if (message.guild?.channels.cache.get(args[0]) || message.mentions.channels.first()) {
                channel = <TextChannel>message.guild?.channels.cache.get(args[0]) || message.mentions.channels.first();
                if (args[1]) {
                    if (ms(args[1])) {
                        duration = ms(args[1]);
                        reason = args.slice(1).join(' ') || 'Not Specified';
                    }
                }
            } else if (ms(args[0])) {
                // duration specified
                duration = ms(args[0]);
                reason = args.splice(1).join(' ');
                if (!checkTextChannel(message.channel)) return;

                channel = message.channel;
            } else {
                // duration not specified
                duration = 0;
                reason = args.splice(0).join(' ');
                if (!checkTextChannel(message.channel)) return;

                channel = message.channel;
            }
        } else {
            duration = 0;
            reason = 'Not Specified';
            if (!checkTextChannel(message.channel)) return;
            channel = message.channel;
        }
        const settings = await message.guild.settings();
        const memberRole = settings?.verifiedRole;
        if (!memberRole) {
            throw new Error(
                'You need to set up a verified role (the verified role is like how members are able to get full access of the server)'
            );
        }
        if (!channel.permissionsFor(memberRole)?.has('SEND_MESSAGES'))
            throw new Error('This channel is already locked');
        const botPosition = message.guild?.me?.roles.highest.position;
        const verifiedRolePosition = message.guild?.roles.cache.get(memberRole)?.position;
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
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                })
                .then(() => {
                    channel.setName(`🔒 ${channel.name}`);
                    const embed = new MessageEmbed()
                        .setTitle('🔒 CHANNEL LOCKED 🔒')
                        .setDescription(
                            'This channel has been locked due to the behavior in this channel please read the information carefully'
                        )
                        .setAuthor(
                            `Issued By: ${message.author.tag}`,
                            message.author.displayAvatarURL({ dynamic: true })
                        )
                        .setTimestamp()
                        .setFooter(`User ID: ${message.author.id}`)
                        .setColor('RED');
                    if (duration) {
                        embed.addField('Duration', `${duration} Hours`);
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
};
