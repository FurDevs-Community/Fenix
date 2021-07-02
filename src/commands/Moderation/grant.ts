import HozolClient from '../../lib/HozolClient';
import { GuildMember, Message } from 'discord.js';
import { Command } from 'nukejs';
import { addRole, usernameResolver } from './../../helper';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'grant',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
            userPerms: ['MANAGE_MESSAGES'],
            description:
                'Discord Staff Command to create a private text channel between staff member and member(s)',
            enabled: true,
            extendedHelp:
                'Discord Staff Command to create a private text channel between staff member and member(s).',
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
        const guildSettings = await message.guild.settings();
        const member = args[0];

        // Reject if command not used in an incidents channel
        if (
            message.channel.type !== 'text' ||
            !guildSettings?.incidentsCategory ||
            !message.channel.parent ||
            message.channel.parent.id !== guildSettings.incidentsCategory
        ) {
            // await sails.helpers.spam.add(message.member, 20, message);
            client.error('Error');
            throw new Error(
                'This command may only be used in an incidents channel.'
            );
        }

        // Reject if: not a support channel and not staff, or support channel and not author.
        if (message.channel.name.startsWith('support-')) {
            if (!message.channel.topic?.includes(`${message.member?.id}|`)) {
                // await sails.helpers.spam.add(message.member, 20, message);
                client.error('Error');

                throw new Error(
                    'Only the person who created the support channel may use the grant command.'
                );
            }
        }
        const user = await usernameResolver(message, member);
        const mem = <GuildMember>message.guild?.members.resolve(user);

        // Grant permissions
        await message.channel.updateOverwrite(
            mem,
            {
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
            },
            'Use of the grant command'
        );

        // Add message
        if (message.channel.name.startsWith('support-')) {
            message.channel.send(
                ':white_check_mark: Member has been granted access to this channel.'
            );
        } else if (message.channel.name.startsWith('inquiry-')) {
            message.channel.send(
                `<@${mem.id}>, **staff would like to speak with you** in this private text channel. Usually, inquiry channels do not mean you are in trouble. Please wait until a staff member addresses you.`
            );
        } else if (message.channel.name.startsWith('interrogation-')) {
            await addRole(
                mem,
                'muteRole',
                `grant command on ${message.channel.name}`
            );
            message.channel.send(
                `<@${mem.id}>, **staff would like to ask you some questions about something recent you did**. You are muted in the guild during this interrogation for the safety of others. You are expected to be respectful of staff and answer their questions with honesty. You may request at any time for the interrogation to end; staff will use what they have at that point to decide on disciplinary action, if necessary, but you forego the opportunity to defend yourself.`
            );
        }
    }
}
