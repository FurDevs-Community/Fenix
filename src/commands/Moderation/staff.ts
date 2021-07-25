import HozolClient from '../../lib/HozolClient';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';

import { Command } from 'nukejs';
import { checkActions, checkTextChannel, createChannel } from './../../helper';
import { defaultPrefix } from './../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'staff',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['inquiry'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
            userPerms: [],
            description: 'Discord Staff Command to create a private text channel between staff member and member(s)',
            enabled: true,
            extendedHelp: 'Discord Staff Command to create a private text channel between staff member and member(s).',
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
        const moderation = await message.member!.moderation();
        const guild: any = message.guild;
        const hasActions = await checkActions(moderation, 'Cannot use staff command');
        if (moderation.length > 0 && hasActions) {
            throw new Error(
                `You are not allowed to use the staff command due to past abuse. Please contact a staff member via DMs instead.`
            );
        } else {
            const guildSettings = await message.guild.settings();
            const prefix = guildSettings?.prefix || defaultPrefix;
            const isStaff = message.member?.hasPermission('VIEW_AUDIT_LOG');

            // Count open channels if not staff and error if they already have 3 channels open
            if (!isStaff) {
                const channels: any = message.guild?.channels.cache.filter((channel): any => {
                    if (!checkTextChannel(channel)) return;
                    channel.type === 'text' &&
                        guildSettings?.incidentsCategory &&
                        channel.parent &&
                        channel.parent.id === guildSettings.incidentsCategory &&
                        channel.name.startsWith('inquiry-') &&
                        channel.topic?.includes(`${message.author.id}|`);
                });

                if (channels?.length > 2) {
                    // await sails.helpers.spam.add(message.member, 20, message);
                    throw new Error('You may only have up to 3 staff/inquiry channels open at a time.');
                }
            }

            // Create the channel
            const channel = await createChannel('inquiry', guild, [message.member]);

            // Create the intro message
            const inquiryIntro = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`🗨️ Inquiry ${channel?.name.split('-')[1]}`)
                .setColor(`BLUE`)
                .setFooter(`User ID: ${message.author.id}`);
            if (isStaff) {
                inquiryIntro.setDescription(
                    `<@${message.member?.id}>, to add members you would like to speak to, use the command \`${prefix}grant <member>\``
                );
                channel?.send(`<@${message.member?.id}>`, {
                    embed: inquiryIntro,
                });
            } else {
                inquiryIntro.setDescription(
                    `**Staff, <@${message.member?.id}> would like to speak with you**.\n<@${message.member?.id}>, please send your inquiry here. If you are reporting members for rule violations, explain the violation and upload evidence, such as screenshots and recordings.`
                );
                channel?.send(`<@${message.member?.id}>`, {
                    embed: inquiryIntro,
                });
            }
        }
    }
};
