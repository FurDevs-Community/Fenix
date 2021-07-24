import HozolClient from '../../lib/HozolClient';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Command } from 'nukejs';
import { muteUser } from '../../database/index';
import { createChannel } from '../../helper/guild/createChannel';
import { usernameResolver } from '../../helper/resolvers/usernameResolver';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'interogate',
            category: 'Moderation',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
            userPerms: ['MANAGE_MESSAGES'],
            description: 'Interogate a guild member',
            enabled: true,
            extendedHelp: 'Creates a private channel between a member and staff for interogation.',
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
        const settings = await message.guild.settings();
        if (!settings.muteRole) throw new Error('You need to setup a mute role in order to use the interogate comand');
        await message.delete();
        const user = await usernameResolver(message, args[0]);
        const member = await message.guild.members.cache.get(user.id);
        if (member) {
            const botPosition = message.guild.me?.roles.highest.position;
            const userPosition = member.roles.highest.position;
            const modPosition = message.member?.roles.highest.position;
            if (botPosition! <= userPosition) {
                throw new Error(
                    `The bot's highest role (${message.guild?.me?.roles.highest}) must be above the user's highest role (${member.roles.highest}) in order to interogate & mute that user`
                );
            }
            if (modPosition! <= userPosition) {
                throw new Error(
                    `Your highest role (${message.member?.roles.highest}) must be higher than the user's highest role (${member.roles.highest}) in order for me to interogate & mute that user`
                );
            }
        } else {
            throw new Error('The user must be in the guild in order to be interogated');
        }
        const interogationChannel = await createChannel('interrogation', message.guild, [member, message.member]);
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`⚠️ Interogation ${interogationChannel?.name.split('-')[1]}`)
            .setColor(`YELLOW`)
            .setFooter(`User ID: ${message.author.id}`)
            .setDescription(
                `Heya, Staff would like to ask you questions concerning about your recent actions.\n\nPlease keep a mind:\n- During the interogation you may not leave the guild as it'll result in a punishment\n- You are muted from the guild until this interogation is over\n- Please be respectful with others and staff failure doing so may result in a requirement`
            );
        interogationChannel?.send(`<@${member?.user.id}>`, {
            embed: embed,
        });

        member.roles
            .add(
                settings.muteRole,
                `Interogation ${interogationChannel?.name.split('-')[1]} - From ${message.author.tag}`
            )
            .then(async () => {
                await muteUser(message.guild!.id, member.user.id);
            });
    }
};
