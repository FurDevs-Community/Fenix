import HozolClient from '../../lib/HozolClient';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import { removeRole, usernameResolver } from '../../helper';
import { askQuestion } from '../../helper/moderation/askRules';
import { unMuteUser } from '../../database';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'unmute',
            category: 'Moderation',
            runIn: ['text'],
            aliases: ['unsilence'],
            botPerms: ['MANAGE_ROLES', 'SEND_MESSAGES', 'EMBED_LINKS'],
            userPerms: ['MANAGE_ROLES'],
            description: 'Unmute a Member',
            enabled: true,
            extendedHelp: 'Unmutes a member.',
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
        const settings = await message.guild?.settings();
        const user = await usernameResolver(message, args[0]);
        const member = message.guild.members.cache.get(user.id);
        if (member) {
            const botPosition = message.guild.me?.roles.highest.position;
            const userPosition = member.roles.highest.position;
            if (botPosition! <= userPosition) {
                throw new Error(
                    `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to unmute that user`
                );
            }
        } else {
            throw new Error(`The user doesn't exist in the server`);
        }
        const memberSettings = await member.settings();
        console.log(member.roles.cache.has(settings['muteRole']));
        if (
            !memberSettings.muted &&
            !member.roles.cache.has(settings['muteRole'])
        ) {
            throw new Error(`The user is not muted`);
        }
        let reason: string | undefined;
        if (settings.reasonSpecify !== 'ignore') {
            let correct = false;
            while (!correct) {
                reason = <string>(
                    (<unknown>(
                        await askQuestion(
                            message,
                            `Why should the user be unumuted`
                        )
                    ))
                );
                if (reason && reason !== 'none') {
                    correct = true;
                }
            }
        } else {
            reason = 'No reason was provided; contact ' + message.author.tag;
        }

        await unMuteUser(message.guild.id, user.id);
        const result = await removeRole(
            member,
            'muteRole',
            `${
                reason
                    ? reason
                    : 'No reason was provided; contact ' + message.author.tag
            }`
        );
        if (!result)
            throw new Error("Couldn't removed the mute role from that use");
        const embed = new MessageEmbed()
            .setTitle('Unmute')
            .setAuthor(
                `Unmuted By: ${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .addField('Violator', `${member.user.username}(${member.user.id})`)
            .addField('Reason:', reason)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`)
            .setColor('BLUE');
        message.channel.send(embed);
    }
};
